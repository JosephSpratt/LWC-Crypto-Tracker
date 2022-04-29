import { LightningElement, track } from 'lwc';
import getToken from '@salesforce/apex/CryptoTrackerHelper.getToken';
import assetIdLookup from '@salesforce/apex/CryptoTrackerHelper.assetIdLookup';
import getAssetInfo from '@salesforce/apex/CryptoTrackerHelper.getAssetInfo';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartjs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CryptoTracker extends LightningElement {
    authToken;
    coinBasicInfo;
    coinFinancialInfo;
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
            marketCapPercentChange7d: 'Market Cap Change (7d): ' + this.coinFinancialInfo.marketCapPercentChange.change7d + '%',
            marketCapPercentChange24h: 'Market Cap Change (24h): ' + this.coinFinancialInfo.marketCapPercentChange.change24h + '%',
            marketCapPercentChange30d: 'Market Cap Change (30d): ' + this.coinFinancialInfo.marketCapPercentChange.change30d + '%'
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
            let config = {
                // The type of chart we want to create
                type: 'line',
                // The data for our dataset
                data: {
                    labels: ['24h Change', this.formateDate(this.coinFinancialInfo.timestamp)],
                    datasets: [{
                        label: this.coinBasicInfo.name + ' - Market Price',
                        data: this.calculatePriceChange(),
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                        pointStyle: 'crossRot',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: this.chartColour
                    }]
                },
                // Configuration options go here
                options: {}
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
        prices.push(this.percentage(this.coinFinancialInfo.price, this.coinFinancialInfo.pricePercentChange.change24h));
        prices.push(this.coinFinancialInfo.price);
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