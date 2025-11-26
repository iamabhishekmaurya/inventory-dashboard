'use client'
import { api } from '@/lib/api'
import { DEMO, mockTypes, mockBrands, mockItems, mockQuantities, mockSales, mockSuppliers, mockPOs, mockWarehouses, mockBins, mockTransfers, mockReturns, mockCycleCounts, mockAdjustments } from './mock'

async function tryApi<T>(fn:()=>Promise<T>, fallback: T): Promise<T> {
  if (DEMO) return fallback
  try { return await fn() } catch { return fallback }
}

export const dataApi = {
  getTypes: async () => tryApi(async ()=> (await api.get('/item-type')).data, mockTypes),
  getBrands: async () => tryApi(async ()=> (await api.get('/brand')).data, mockBrands),
  getActiveBrandsByType: async (itemTypeId:number) => tryApi(async ()=> (await api.get(`/brand/active/${itemTypeId}`)).data, mockBrands.filter(b=> b.itemTypeId === itemTypeId && b.status)),
  getItems: async () => tryApi(async ()=> (await api.get('/item')).data, mockItems),
  getActiveItemsByBrand: async (brandId:number) => tryApi(async ()=> (await api.get(`/item/active/${brandId}`)).data, mockItems.filter(i=> i.itemBrandId === brandId && i.status)),
  getInventory: async () => tryApi(async ()=> (await api.get('/quantity')).data, mockQuantities),
  getActiveInventoryByItem: async (itemId:number) => tryApi(async ()=> (await api.get(`/quantity/active/${itemId}`)).data, mockQuantities.filter(q=> q.itemId === itemId && q.status)),
  getSales: async () => tryApi(async ()=> (await api.get('/sales')).data, mockSales),
  getSuppliers: async () => tryApi(async ()=> (await api.get('/suppliers')).data, mockSuppliers),
  getPurchaseOrders: async () => tryApi(async ()=> (await api.get('/purchase-orders')).data, mockPOs),
  getWarehouses: async () => tryApi(async ()=> (await api.get('/warehouses')).data, mockWarehouses),
  getBins: async () => tryApi(async ()=> (await api.get('/bins')).data, mockBins),
  getTransfers: async () => tryApi(async ()=> (await api.get('/transfers')).data, mockTransfers),
  getReturns: async () => tryApi(async ()=> (await api.get('/returns')).data, mockReturns),
  getCycleCounts: async () => tryApi(async ()=> (await api.get('/cycle-counts')).data, mockCycleCounts),
  getAdjustments: async () => tryApi(async ()=> (await api.get('/adjustments')).data, mockAdjustments),
}

