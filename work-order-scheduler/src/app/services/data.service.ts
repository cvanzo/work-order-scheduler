import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY = 'naologic_work_orders';

  // 1. Initial Work Centers (Static for this test)
  private workCenters$ = new BehaviorSubject<WorkCenterDocument[]>([
    { docId: 'wc_1', docType: 'workCenter', data: { name: 'Funnel Distribution' } },
    { docId: 'wc_2', docType: 'workCenter', data: { name: 'Software Handling' } },
    { docId: 'wc_3', docType: 'workCenter', data: { name: 'Assembled Electronics' } },
    { docId: 'wc_4', docType: 'workCenter', data: { name: 'Awesome Hardware' } },
    { docId: 'wc_5', docType: 'workCenter', data: { name: 'Tims Manufacturing' } },
  ]);

  // 2. Initial Work Orders (Checks LocalStorage first, otherwise defaults)
  private workOrders$ = new BehaviorSubject<WorkOrderDocument[]>(this.loadInitialOrders());

  // --- Getters ---
  getWorkCenters(): Observable<WorkCenterDocument[]> {
    return this.workCenters$.asObservable();
  }

  getWorkOrders(): Observable<WorkOrderDocument[]> {
    return this.workOrders$.asObservable();
  }

  // --- Mutations ---
  addWorkOrder(order: WorkOrderDocument) {
    const current = this.workOrders$.value;
    const updated = [...current, order];
    this.saveAndNotify(updated);
  }

  updateWorkOrder(updatedOrder: WorkOrderDocument) {
    const current = this.workOrders$.value;
    const index = current.findIndex(o => o.docId === updatedOrder.docId);
    if (index > -1) {
      current[index] = updatedOrder;
      this.saveAndNotify([...current]);
    }
  }

  deleteWorkOrder(docId: string) {
    const updated = this.workOrders$.value.filter(o => o.docId !== docId);
    this.saveAndNotify(updated);
  }

  // --- Helpers ---
  private saveAndNotify(orders: WorkOrderDocument[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    this.workOrders$.next(orders);
  }

  private loadInitialOrders(): WorkOrderDocument[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // Default 8 orders if nothing in storage
    return [
    { 
      docId: 'wo_1', docType: 'workOrder', 
      data: { name: 'Bicycle World', workCenterId: 'wc_1', status: 'complete', startDate: '2026-01-05', endDate: '2026-04-15' } 
    },
    { 
      docId: 'wo_2', docType: 'workOrder', 
      data: { name: 'Handlebar Systems', workCenterId: 'wc_2', status: 'in-progress', startDate: '2025-11-10', endDate: '2026-08-20' } 
    },
    { 
      docId: 'wo_3', docType: 'workOrder', 
      data: { name: 'Final Distribution', workCenterId: 'wc_3', status: 'complete', startDate: '2025-10-15', endDate: '2026-01-15' } 
    },
    { 
      docId: 'wo_4', docType: 'workOrder', 
      data: { name: 'Paint Inspection Ltd', workCenterId: 'wc_4', status: 'blocked', startDate: '2025-12-01', endDate: '2026-04-15' } 
    },
    { 
      docId: 'wo_5', docType: 'workOrder', 
      data: { name: 'Crate Builders', workCenterId: 'wc_5', status: 'open', startDate: '2026-02-01', endDate: '2026-08-30' } 
    },
    { 
      docId: 'wo_6', docType: 'workOrder', 
      data: { name: 'Hammond Assembly Inc', workCenterId: 'wc_3', status: 'in-progress', startDate: '2026-01-18', endDate: '2026-05-15' } 
    },
    { 
      docId: 'wo_7', docType: 'workOrder', 
      data: { name: 'Metrics Measured', workCenterId: 'wc_1', status: 'open', startDate: '2026-06-01', endDate: '2026-11-01' } 
    },
    { 
      docId: 'wo_8', docType: 'workOrder', 
      data: { name: 'Chain Inc', workCenterId: 'wc_3', status: 'open', startDate: '2026-06-01', endDate: '2027-04-01' } 
    },
    { 
      docId: 'wo_9', docType: 'workOrder', 
      data: { name: 'Global Logistics Corp', workCenterId: 'wc_2', status: 'open', startDate: '2027-01-15', endDate: '2027-06-15' } 
    },
    { 
      docId: 'wo_10', docType: 'workOrder', 
      data: { name: 'Vertex Systems', workCenterId: 'wc_4', status: 'in-progress', startDate: '2026-04-21', endDate: '2027-08-01' } 
    }
  ];
  }
}