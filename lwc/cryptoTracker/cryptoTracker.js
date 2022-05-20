import { LightningElement, track } from 'lwc';
import getToken from '@salesforce/apex/CryptoTrackerHelper.getToken';
import assetIdLookup from '@salesforce/apex/CryptoTrackerHelper.assetIdLookup';
import getAssetInfo from '@salesforce/apex/CryptoTrackerHelper.getAssetInfo';
import getAssetHistory from '@salesforce/apex/CryptoTrackerHelper.getAssetHistory';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartjs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTrendingCoins from '@salesforce/apex/CryptoTrackerHelper.getTrendingCoins';

export default class CryptoTracker extends LightningElement {
    authToken;
    coinBasicInfo;
    coinFinancialInfo;
    coinHistoryInfo;
    @track trendingCoins = [];
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

    get pricePercentChangeClass7d(){
        return this.coinFinancialInfo.pricePercentChange.change7d > 0 ? 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-green' : 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-red';
    }

    get pricePercentChangeClass24h(){
        return this.coinFinancialInfo.pricePercentChange.change24h > 0 ? 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-green' : 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-red';
    }

    get pricePercentChangeClass30d(){
        return this.coinFinancialInfo.pricePercentChange.change30d > 0 ? 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-green' : 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-red';
    }

    get volumePercentChangeClass7d(){
        return this.coinFinancialInfo.volumePercentChange.change7d > 0 ? 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-green' : 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-red';
    }

    get volumePercentChangeClass24h(){
        return this.coinFinancialInfo.volumePercentChange.change24h > 0 ? 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-green' : 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-red';
    }

    get volumePercentChangeClass30d(){
        return this.coinFinancialInfo.volumePercentChange.change30d > 0 ? 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-green' : 'slds-card__header-title slds-text-body_small slds-text-color_weak slds-m-top_xx-small slds-col slds-size_2-of-3 percentage-red';
    }

    get chartColour(){
        return this.coinFinancialInfo.pricePercentChange.change24h > 0 ? 'rgba(22, 187, 22, 1)' : 'rgba(195, 2, 2, 1)';
    }

    get trendingCoins(){
        return this.trendingCoins;
    }

    get allCoinInfo(){
        const formattedCoinInfo = {
            name: this.coinBasicInfo.name.toUpperCase(),
            url: this.coinBasicInfo.url,
            price: '$' + this.coinHistoryInfo[this.coinHistoryInfo.length - 1].close,
            pricePercentChange24hHeader: this.coinFinancialInfo.pricePercentChange.change24h + '%',
            pricePercentChange7d: this.coinFinancialInfo.pricePercentChange.change7d + '%',
            pricePercentChange24h: this.coinFinancialInfo.pricePercentChange.change24h + '%',
            pricePercentChange30d: this.coinFinancialInfo.pricePercentChange.change30d + '%',
            volume: '$' + this.coinFinancialInfo.volume,
            volumeRank: this.coinFinancialInfo.volumeRank,
            volumePercentChange7d: this.coinFinancialInfo.volumePercentChange.change7d + '%',
            volumePercentChange24h: this.coinFinancialInfo.volumePercentChange.change24h + '%',
            volumePercentChange30d: this.coinFinancialInfo.volumePercentChange.change30d + '%'
        }
        return formattedCoinInfo;
    }

    connectedCallback() {
        this.getAuthToken();
        this.getTrendingCoins();
    }

    getTrendingCoins(){
        getTrendingCoins().then(result => {
            result.Data.map(row => {
                let percDec = parseFloat(row.RAW.USD.CHANGEPCTHOUR);
                let percH = percDec.toFixed(2);
                let coin = row.RAW.USD.FROMSYMBOL;
                let priceDecimal = parseFloat(row.RAW.USD.PRICE);
                let price = priceDecimal.toFixed(2);
                let className = this.percentageClass(percH);
                this.trendingCoins.push({coin: coin, price: price, percH:percH, className: className});
            })
            
        }).catch(error => {
            this.dispatchError(error);
        })
    }

    getAuthToken() {
        getToken().then(result => {
            this.authToken = result;
            
        }).catch(error => {
            this.dispatchError(error);
        })
    }

    dispatchError(error){      
            this.dispatchEvent(
                new ShowToastEvent({
                title: 'Error getting auth token',
                message: error.message,
                variant: 'error',
            }),
        );
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
                    labels: ['','', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
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
            this.dispatchError(error);
        });
    }

    percentageClass(percentage){
        let className;
        if(percentage.includes('-')){
            className = 'percentage-red';
        } else {
            className = 'percentage-green';
        }
        return className;
    }

    updateChart() {
        this.hideCoinDisplays = false;
        if (this.chartjsInitialized) {
            this.updateChartDataAndConfig();
        }
        else {
            this.initialiseChart();
        }
    }

    updateChartDataAndConfig(){
        this.chart.data.datasets[0].label = this.coinBasicInfo.name + ' - Market Price';
        this.chart.data.datasets[0].backgroundColor = this.chartColour;
        this.chart.data.datasets[0].data = this.calculatePriceChange();
        this.chart.update();
    }

    formateDate(date){
        const toDate = new Date(date);
        return String(toDate).split("GMT")[0];
    }

    calculatePriceChange(){
        const prices = []
        for(let i = 0, len = this.coinHistoryInfo.length; i < len; i++){
            prices.push(this.coinHistoryInfo[i].close);
        }
        return prices;
    }

    percentage(num, per){
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
                    getAssetInfo({ assetId: this.coinBasicInfo.id, token: this.authToken }).then(result => {
                        if (result.content != undefined) {
                            this.coinFinancialInfo = result.content[0];
                            getAssetHistory({ticker: tickerCoin}).then(result => {
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
                                this.dispatchError(error);
                            });
                        } else {
                            this.hideTickerMessage = false;
                        }
                    }).catch(error => {
                        this.dispatchError(error);
                    })
                }
                else {
                    this.hideTickerMessage = false;
                }
            }).catch(error => {
                this.dispatchError(error);
            })
        }
    }
}