import { DataTablesModule } from 'angular-datatables';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ResolverService } from '../../services/resolver.service'
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  public data: any
  public postStats: any
  constructor(private user: UserService, private actr: ActivatedRoute, private post: PostService) {
    // this.actr.data.map(data=>data.cres.json()).subscribe(res=>{console.log(res)})
   }

  ngOnInit() {
    
    this.data = this.actr.snapshot.data['cres']
    
    var ctx = 'myChart';
  
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['All', 'Verified', 'Unverified', 'Landlord', 'Broker', 'Admin'],
        datasets: [{
          label: '# of Votes',
          data: this.data.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.postStats = this.actr.snapshot.data['posts']
    console.log('post stats:', this.postStats)
  

    var ctx_mychart = 'my_Chart';
    var my_Chart = new Chart(ctx_mychart, {
      type: 'pie',
      data: {
        labels: ['All Posts', 'Active', 'Inactive', 'Featured', 'Featured Requests'],
        datasets: [{
          label: '# of Votes',
          data: this.postStats.allStats,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}
