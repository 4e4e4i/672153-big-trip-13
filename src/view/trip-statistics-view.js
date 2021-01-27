import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {ChartConfiguration, EventType, TimeInMs, TRANSPORT_TYPES} from '../helpers/constants.js';
import Smart from "./smart";

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
    </section>
  `);
};

export default class TripStatisticsView extends Smart {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    this._destroyCharts();
  }

  restoreHandlers() {
    this._renderCharts();
  }

  _renderCharts() {
    const moneyCtxElement = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtxElement = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtxElement = this.getElement().querySelector(`.statistics__chart--time`);

    this._tripEvents = this._pointsModel.getPoints();

    this._tripEventsTypes = this._getTripEventsTypes();
    this._tripEventsChartData = this._getTripEventsChartData();
    this._transportEvents = this._getTransportEventsCounts();

    this._moneyChart = this._renderMoneyChart(moneyCtxElement);
    this._transportChart = this._renderTransportChart(transportCtxElement);
    this._timeSpendChart = this._renderTimeSpendChart(timeSpendCtxElement);
  }

  _getTripEventsTypes() {
    const tripEventChartData = [];

    this._tripEvents.forEach((tripEvent) => {
      if (tripEventChartData.indexOf(tripEvent.type) === -1) {
        tripEventChartData.push(tripEvent.type);
      }
    });

    return tripEventChartData;
  }

  _getTripEventsChartData() {
    const tripEventsChartData = this._tripEventsTypes.map((tripEvent) => {
      return {
        type: tripEvent,
        label: EventType[tripEvent],
        money: this._getMoneyValues(tripEvent),
        timeSpend: this._getTimeSpend(tripEvent),
      };
    });

    return tripEventsChartData;
  }

  _getMoneyValues(tripEventType) {
    const allTripEventsTypes = this._filterTripEventTypes(tripEventType);
    return allTripEventsTypes.reduce((totalValue, tripEvent) => totalValue + tripEvent.totalPrice, 0);
  }

  _getTimeSpend(tripEventType) {
    const allTripEventsTypes = this._filterTripEventTypes(tripEventType);
    const totalDifference = allTripEventsTypes.reduce((totalTimeDifference, tripEvent) => {
      return totalTimeDifference + (tripEvent.endTime - tripEvent.startTime);
    }, 0);
    const differenceInHours = Math.round(totalDifference / TimeInMs.HOUR);

    return differenceInHours;
  }

  _getTransportEvents() {
    const transportEvents = [];
    TRANSPORT_TYPES.forEach((type) => {
      this._tripEvents.forEach((tripEvent) => {
        if (tripEvent.type === type) {
          transportEvents.push(tripEvent.type);
        }
      });
    });

    return transportEvents;
  }

  _getTransportEventsCounts() {
    const transportEvents = this._getTransportEvents();

    const transportEventCounts = transportEvents.reduce((count, tripEvent) => {
      count[tripEvent] = (count[tripEvent] || 0) + 1;
      return count;
    }, {});

    return transportEventCounts;
  }

  _filterTripEventTypes(tripEventType) {
    const tripEventTypes = this._tripEvents.filter((tripEvent) => tripEventType === tripEvent.type);
    return tripEventTypes;
  }

  _renderMoneyChart(moneyCtxElement) {
    moneyCtxElement.height = ChartConfiguration.BAR_HEIGHT * this._tripEventsTypes.length;

    return new Chart(moneyCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfiguration.CHART_TYPE,
      data: {
        labels: this._tripEventsChartData.map((item) => item.label),
        datasets: [{
          data: this._tripEventsChartData.map((item) => item.money),
          backgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartConfiguration.FONT_SIZE
            },
            color: ChartConfiguration.FONT_COLOR,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: ChartConfiguration.MONEY_CHART_TEXT,
          fontColor: ChartConfiguration.FONT_COLOR,
          fontSize: ChartConfiguration.TITLE_FONT_SIZE,
          position: `left`,
        },
        layout: {
          padding: {
            left: ChartConfiguration.CHART_PADDING_LEFT
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartConfiguration.FONT_COLOR,
              padding: ChartConfiguration.SCALE_Y_AXES_TICKS_PADDING,
              fontSize: ChartConfiguration.FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: ChartConfiguration.BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: ChartConfiguration.MIN_BAR_LENGTH
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _renderTransportChart(transportCtxElement) {
    transportCtxElement.height = ChartConfiguration.BAR_HEIGHT * Object.keys(this._transportEvents).length;

    return new Chart(transportCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfiguration.CHART_TYPE,
      data: {
        labels: Object.keys(this._transportEvents),
        datasets: [{
          data: Object.values(this._transportEvents),
          backgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartConfiguration.FONT_SIZE
            },
            color: ChartConfiguration.FONT_COLOR,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: ChartConfiguration.TRANSPORT_CHART_TEXT,
          fontColor: ChartConfiguration.FONT_COLOR,
          fontSize: ChartConfiguration.TITLE_FONT_SIZE,
          position: `left`,
        },
        layout: {
          padding: {
            left: ChartConfiguration.CHART_PADDING_LEFT
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartConfiguration.FONT_COLOR,
              padding: ChartConfiguration.SCALE_Y_AXES_TICKS_PADDING,
              fontSize: ChartConfiguration.FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: ChartConfiguration.BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: ChartConfiguration.MIN_BAR_LENGTH
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _renderTimeSpendChart(timeSpendCtxElement) {
    timeSpendCtxElement.height = ChartConfiguration.BAR_HEIGHT * this._tripEventsTypes.length;

    return new Chart(timeSpendCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfiguration.CHART_TYPE,
      data: {
        labels: this._tripEventsChartData.map((item) => item.label),
        datasets: [{
          data: this._tripEventsChartData.map((item) => item.timeSpend),
          backgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartConfiguration.FONT_SIZE
            },
            color: ChartConfiguration.FONT_COLOR,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          }
        },
        title: {
          display: true,
          text: ChartConfiguration.TIME_SPEND_TEXT,
          fontColor: ChartConfiguration.FONT_COLOR,
          fontSize: ChartConfiguration.TITLE_FONT_SIZE,
          position: `left`,
        },
        layout: {
          padding: {
            left: ChartConfiguration.CHART_PADDING_LEFT
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartConfiguration.FONT_COLOR,
              padding: ChartConfiguration.SCALE_Y_AXES_TICKS_PADDING,
              fontSize: ChartConfiguration.FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: ChartConfiguration.BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: ChartConfiguration.MIN_BAR_LENGTH
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _destroyCharts() {
    this._destroyChart(`_moneyChart`);
    this._destroyChart(`_transportChart`);
    this._destroyChart(`_timeSpendChart`);
  }

  _destroyChart(chart) {
    if (this[chart]) {
      this[chart].destroy();
      this[chart] = null;
    }
  }
}
