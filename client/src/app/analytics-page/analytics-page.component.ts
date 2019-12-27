import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Chart} from 'chart.js'
import {Subscription} from "rxjs";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  // @ts-ignore
  @ViewChild('gain') gainRef: ElementRef
  // @ts-ignore
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255,99,132)'
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54,162,235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)
      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      //**** Gain **** //
      // gainConfig.labels.push('05.09.2019')
      // gainConfig.labels.push('06.09.2019')
      // gainConfig.data.push(1500)
      // gainConfig.data.push(700)
      //**** /Gain **** //

      //**** Order **** //
      // orderConfig.labels.push('05.09.2019')
      // orderConfig.labels.push('06.09.2019')
      // orderConfig.data.push(8)
      // orderConfig.data.push(2)
      //**** /Order **** //

      const gainContext = this.gainRef.nativeElement.getContext('2d')
      gainContext.canvas.height = '300px'
      const orderContext = this.orderRef.nativeElement.getContext('2d')
      orderContext.canvas.height = '300px'

      new Chart(gainContext, createChartConfig(gainConfig))
      new Chart(orderContext, createChartConfig(orderConfig))

      this.pending = false

    })
  }

  ngOnDestroy() {
    if (this.aSub)
      this.aSub.unsubscribe()
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false

        }
      ]
    }
  }

}
