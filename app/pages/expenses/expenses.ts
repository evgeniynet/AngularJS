import {Page, Config, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency} from '../../directives/helpers';
import {ExpenseCreatePage} from '../expense-create/expense-create';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/expenses/expenses.html',
    directives: [ActionButtonComponent],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class ExpensesPage {
    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config) {
        this.is_empty = false;
  }
    
    onPageLoaded()
    {
        let pager = {limit: 25};

        this.dataProvider.getTimelogs(pager).subscribe(
            data => {
                this.timelogs = data;
                this.is_empty = !data || data.length == 0;
            }, 
            error => { 
                console.log(error || 'Server error');}
        );
    }
    
    itemTapped(time) {
        this.nav.push(ExpenseCreatePage, time);
    }
    
     setDate(date) {
      return new Date(date);
  }

     getCurrency(value) {
         return getCurrency(value, this.config.current.currency);
     }
}
