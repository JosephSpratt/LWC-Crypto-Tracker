import { LightningElement, track } from 'lwc';
import getToken from '@salesforce/apex/CryptoTrackerHelper.getToken';
import assetIdLookup from '@salesforce/apex/CryptoTrackerHelper.assetIdLookup';
import getAssetInfo from '@salesforce/apex/CryptoTrackerHelper.getAssetInfo';
import getAssetHistory from '@salesforce/apex/CryptoTrackerHelper.getAssetHistory';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartjs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CryptoTracker extends LightningElement {
    authToken;
    coinBasicInfo;
    coinFinancialInfo;
    coinHistoryInfo;
    chart;
    config;
    hideCoinDisplays = true;
    hideTickerMessage = true;
    chartjsInitialized = false;

    get hideMessage() {
        return this.hideTickerMessage;
    }

    get hideCoinDisplays() {
        return this.hideCoinDisplays;
    }

    get coinPercentageClass(){
        return this.coinFinancialInfo.pricePercentChange.change24h > 0 ? 'slds-text-body_medium slds-text-color_success' : 'slds-text-body_medium slds-text-color_error';
    }

    get chartColour(){
        return this.coinFinancialInfo.pricePercentChange.change24h > 0 ? 'rgba(22, 187, 22, 1)' : 'rgba(195, 2, 2, 1)';
    }

    get allCoinInfo(){
        const formattedCoinInfo = {
            name: this.coinBasicInfo.name.toUpperCase(),
            url: this.coinBasicInfo.url,
            price: '$' + this.coinFinancialInfo.price.toFixed(2),
            pricePercentChange24hHeader: this.coinFinancialInfo.pricePercentChange.change24h + '%',
            pricePercentChange7d: this.coinFinancialInfo.pricePercentChange.change7d + '%',
            pricePercentChange24h: this.coinFinancialInfo.pricePercentChange.change24h + '%',
            pricePercentChange30d: this.coinFinancialInfo.pricePercentChange.change30d + '%',    
            marketCap: '$' + this.coinFinancialInfo.marketCap,
            marketCapRank: this.coinFinancialInfo.marketCapRank,
            marketCapPercentChange7d: this.coinFinancialInfo.marketCapPercentChange.change7d + '%',
            marketCapPercentChange24h: this.coinFinancialInfo.marketCapPercentChange.change24h + '%',
            marketCapPercentChange30d: this.coinFinancialInfo.marketCapPercentChange.change30d + '%'
        }
        return formattedCoinInfo;
    }

    connectedCallback() {
        this.getAuthToken();
    }

    getAuthToken() {
        getToken().then(result => {
            this.authToken = result;
            console.log(result);
        }).catch(error => {
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error getting auth token',
                    message: error.message,
                    variant: 'error',
                }),
            );
        })
    }

    initialiseChart() {
        this.chartjsInitialized = true;
        Promise.all([
            loadScript(this, chartjs)
        ]).then(() => {
            var delayBetweenPoints = 10;
            var started = {};
            let config = {
                type: 'line',
                data: {
                    labels: ['','', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    //this.formateDate(this.coinFinancialInfo.timestamp)
                    datasets: [{
                        label: this.coinBasicInfo.name + ' - Last 24 Hours',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: this.chartColour,
                        borderWidth: 1,
                        pointRadius: 0,
                        data: this.calculatePriceChange(),
                        fill: true,
                        lineTension: 0,
                        animation: (context) => {
                            var delay = 0;
                            var index = context.dataIndex;
                            var chart = context.chart;
                            if (!started[index]) {
                              delay = index * delayBetweenPoints;
                              started[index] = true;
                            }
                            var {x,y} = index > 0 ? chart.getDatasetMeta(0).data[index-1].getProps(['x','y'], true) : {x: 0, y: chart.scales.y.getPixelForValue(100)};
                            
                            return {
                              x: {
                                easing: "linear",
                                duration: delayBetweenPoints,
                                from: x,
                                delay
                              },
                              y: {
                                easing: "linear",
                                duration: delayBetweenPoints * 500,
                                from: y,
                                delay
                              },
                              skip: {
                                type: 'boolean',
                                duration: delayBetweenPoints,
                                from: true,
                                to: false,
                                delay: delay
                              }
                            };
                          }
                        }]
                },
                options: {
                    layout: {
                        padding: {
                            left: 10,
                            right: 20,
                            top: 0,
                            bottom: 0
                        }
                    },
                    scales: {
                        x: {
                          type: 'linear'
                        }
                      }
                    },
                    plugins: [{
                      id: 'force_line_update',
                      beforeDatasetDraw(chart, ctx) {
                        ctx.meta.dataset.points = ctx.meta.data;
                    }
                }]
            };
            const ctx = this.template.querySelector('canvas.donut').getContext('2d');
            this.chart = new window.Chart(ctx, config);
        })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading ChartJS',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }

    updateChart() {
        this.hideCoinDisplays = false;
        if (this.chartjsInitialized) {
            console.log("update here");
            this.updateChartDataAndConfig();
        }
        else {
            this.initialiseChart();
        }
    }

    updateChartDataAndConfig(){
        console.log(this.chart);
        this.chart.data.datasets[0].label = this.coinBasicInfo.name + ' - Market Price';
        this.chart.data.datasets[0].backgroundColor = this.chartColour;
        this.chart.data.datasets[0].data = this.calculatePriceChange();
        this.chart.data.labels = ['24h Change', this.formateDate(this.coinFinancialInfo.timestamp)];
        this.chart.update();
    }

    formateDate(date){
        const toDate = new Date(date);
        return String(toDate).split("GMT")[0];
    }

    calculatePriceChange(){
        const prices = []
        // prices.push(this.percentage(this.coinFinancialInfo.price, this.coinFinancialInfo.pricePercentChange.change24h));
        for(let i = 0, len = this.coinHistoryInfo.length; i < len; i++){
            prices.push(this.coinHistoryInfo[i].high);
        }
        prices.push(this.coinFinancialInfo.price);
        console.log(prices);
        return prices;
    }

    percentage(num, per){
        console.log(per + ' ' + num + ' ' + (num/100)*per );
        return num - (num/100)*per;
    }

    tickerChangeHandler(event) {
        const tickerCoin = event.target.value.toUpperCase();
        const isEnter = event.keyCode === 13;
        if (isEnter) {
            assetIdLookup({ ticker: tickerCoin }).then(result => {
                if (result.content != undefined) {
                    this.hideTickerMessage = true;
                    this.coinBasicInfo = result.content[0];
                    console.log(this.coinBasicInfo);
                    getAssetInfo({ assetId: this.coinBasicInfo.id, token: this.authToken }).then(result => {
                        if (result.content != undefined) {
                            this.coinFinancialInfo = result.content[0];
                            console.log(this.coinFinancialInfo);
                            getAssetHistory({ticker: tickerCoin}).then(result => {
                                console.log(result);
                                if(result.Response == "Success"){
                                    if(result.Data.Data != undefined){
                                        this.coinHistoryInfo = result.Data.Data;
                                    }else{
                                        this.coinHistoryInfo = null;
                                    }
                                    this.updateChart();
                                } else {
                                    this.hideTickerMessage = false;
                                }
                                
                            }).catch(error => {
                                console.log(error);
                                this.dispatchEvent(
                                    new ShowToastEvent({
                                        title: 'Error loading asset',
                                        message: error.message,
                                        variant: 'error',
                                    }),
                                );
                            });
                        } else {
                            this.hideTickerMessage = false;
                        }
                    }).catch(error => {
                        console.log(error);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error loading asset',
                                message: error.message,
                                variant: 'error',
                            }),
                        );
                    })
                }
                else {
                    this.hideTickerMessage = false;
                }
            }).catch(error => {
                console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading asset',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            })
        }
    }
}