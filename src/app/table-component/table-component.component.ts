import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css']
})
export class TableComponentComponent implements OnInit {

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    this.getAssignedStoreData();
  }

  assignedStoreData: any = [];
  brandDateData: any = [];
  stores: any = [];
  totals: any = {};
  average: boolean = false;

  getAssignedStoreData() {
    this.apiService.getAssignedStore().subscribe(
      success => {
        this.assignedStoreData = success.data;
        this.getBrandDateData(this.assignedStoreData);
      },
      error => {
        console.log("error: ", error);
      }
    );
  }

  getBrandDateData(assignedStoreData: any) {
    this.apiService.getBrandDateData().subscribe(
      success => {
        this.brandDateData = success;
        this.mergeInfoFromResponse(this.assignedStoreData, this.brandDateData, this.average);
      },
      error => {
        console.log("error: ", error);
      }
    );
  }


  mergeInfoFromResponse(assignedStoreData: any, brandDateData: any, average: boolean) {
    this.stores = [];
    this.average = !this.average;

    assignedStoreData.forEach(store => {
      let identifier = store.identifier;
      let name = store.name;
      let dataStore: any;
      let peasants = 0;
      let visitors = 0;
      let cabinets = 0;
      let tickets = 0;
      let revenue = 0;
      let items = 0;
      let permanence = 0;
      let permanenceCount = 0;
      let dayOff = 0;
      let daysWithPeasants = 0;
      let daysWithVisitors = 0;
      let daysWithCabinets = 0;
      let daysWithTickets = 0;
      let daysWithRevenue = 0;
      let daysWithItems = 0;
      let daysWithPermanence = 0;
      let daysWithPermanenceCount = 0;
      let daysWithDayOff = 0;

      for (let i = 0; i < brandDateData.length; i++) {
        if (brandDateData[i].identifier == identifier) {
          dataStore = brandDateData[i];
          break;
        }
      }
      
      //gets total of peasants
      for (var x in dataStore.peasants) {
        peasants += dataStore.peasants[x];
        daysWithPeasants++;
      }

      //gets total of visitors
      for (var x in dataStore.visitors) {
        visitors += dataStore.visitors[x];
        daysWithVisitors++;
      }

      //gets total of cabinets
      for (var x in dataStore.cabinet) {
        cabinets += dataStore.cabinet[x];
        daysWithCabinets++;
      }

      //gets total of tickets
      for (var x in dataStore.tickets) {
        tickets += dataStore.tickets[x];
        daysWithTickets++;
      }

      //gets total of revenue
      for (var x in dataStore.revenue) {
        revenue += dataStore.revenue[x];
        daysWithRevenue++;
      }

      //gets total of items
      for (var x in dataStore.items) {
        items += dataStore.items[x];
        daysWithItems++;
      }

      //gets total of permanence
      for (var x in dataStore.permanence) {
        permanence += dataStore.permanence[x];
        daysWithPermanence++;
      }

      //gets total of permanenceCount
      for (var x in dataStore.permanenceCount) {
        permanenceCount += dataStore.permanenceCount[x];
        daysWithPermanenceCount++;
      }

      //gets total of day off
      for (var x in dataStore.uptime) {
        if (dataStore.uptime[x] == 0) {
          dayOff++;
        }
        daysWithDayOff++;
      }

      if (average) {
        peasants = peasants / daysWithPeasants;
        visitors = visitors / daysWithVisitors;
        cabinets = cabinets / daysWithCabinets;
        tickets = tickets / daysWithTickets;
        revenue = revenue / daysWithRevenue;
        items = items / daysWithItems;
        permanence = permanence / daysWithPermanence;
        permanenceCount = permanenceCount / daysWithPermanenceCount;
        dayOff = dayOff / daysWithDayOff;
      }

      let finalStore = {
        identifier: identifier,
        name: name,
        peasants: peasants.toFixed(2),
        visitors: visitors.toFixed(2),
        attraction: ((visitors / peasants) * 100).toFixed(2),
        cabinets: cabinets.toFixed(2),
        tickets: tickets.toFixed(2),
        persuasion: ((tickets / visitors) * 100).toFixed(2),
        revenue: revenue.toFixed(2),
        averageTicket: ((revenue / tickets)).toFixed(2),
        items: items.toFixed(2),
        itemperTicket: ((items / tickets)).toFixed(2),
        averagePermanence: (((permanence * 100) / permanenceCount) / 6000000).toFixed(2),
        dayOff: dayOff.toFixed(2)
      };

      this.stores.push(finalStore);
    });

    this.calculateTotals(this.stores);
  }


  calculateTotals(stores: any) {
    let totalPeasants = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.peasants);
    }, 0);

    let totalVisitors = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.visitors);
    }, 0);

    let totalAttraction = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.attraction);
    }, 0);

    let totalCabinets = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.cabinets);
    }, 0);

    let totalTickets = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.tickets);
    }, 0);

    let totalPersuasion = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.persuasion);
    }, 0);

    let totalRevenue = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.revenue);
    }, 0);

    let totalAverageTicket = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.averageTicket);
    }, 0);

    let totalItems = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.items);
    }, 0);

    let totalItemperTicket = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.itemperTicket);
    }, 0);

    let totalAveragePermanence = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.averagePermanence);
    }, 0);
    let totalDayOff = stores.reduce(function (total, currentValue) {
      return total + Number(currentValue.dayOff);
    }, 0);

    this.totals = {
      totalPeasants: totalPeasants.toFixed(2),
      totalVisitors: totalVisitors.toFixed(2),
      totalAttraction: totalAttraction.toFixed(2),
      totalCabinets: totalCabinets.toFixed(2),
      totalTickets: totalTickets.toFixed(2),
      totalPersuasion: totalPersuasion.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      totalAverageTicket: totalAverageTicket.toFixed(2),
      totalItems: totalItems.toFixed(2),
      totalItemperTicket: totalItemperTicket.toFixed(2),
      totalAveragePermanence: totalAveragePermanence.toFixed(2),
      totalDayOff: totalDayOff.toFixed(2)
    }

  }
}
