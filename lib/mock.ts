export const DEMO = (process.env.NEXT_PUBLIC_DEMO ?? '1') === '1'

export type Type = { id:number; type:string; status:boolean; createdAt?:string }
export type Brand = { id:number; brandName:string; itemTypeId:number; status:boolean; createdAt?:string }
export type Item = { id:number; itemName:string; itemBrandId:number; status:boolean; createdAt?:string }
export type Quantity = { id:number; itemId:number; inventoryId:number; quantity:number; purchasePrice:number; status:boolean; createdAt?:string; lotNumber?:string; expiryDate?:string; serials?:string[] }
export type Sale = { id:number; itemQuantityId:number; inventoryId:number; salePrice:number; status:boolean; createdAt?:string }
export type Supplier = { id:number; name:string; email?:string; phone?:string; leadTimeDays?:number; terms?:string; rating?:number; status:boolean; createdAt?:string }
export type PurchaseOrder = { id:number; supplierId:number; status:'Draft'|'Approved'|'Received'|'Closed'|'Cancelled'; expectedDate?:string; notes?:string; createdAt?:string }
export type Warehouse = { id:number; name:string; code:string; status:boolean; createdAt?:string }
export type Bin = { id:number; warehouseId:number; code:string; zone?:string; status:boolean; createdAt?:string }
export type Transfer = { id:number; fromWarehouseId:number; toWarehouseId:number; fromBinId?:number; toBinId?:number; itemId?:number; quantity:number; notes?:string; createdAt?:string }
export type Return = { id:number; kind:'Supplier'|'Customer'; itemId:number; quantity:number; reason:string; status:'Requested'|'Approved'|'Rejected'|'Completed'; notes?:string; createdAt?:string }
export type CycleCount = { id:number; warehouseId?:number; binId?:number; scheduledDate?:string; status:'Planned'|'InProgress'|'Completed'; variance?:number; createdAt?:string }
export type Adjustment = { id:number; itemId:number; quantity:number; reason:string; approved:boolean; createdAt?:string }

const today = new Date()
const daysAgo = (n:number) => new Date(today.getTime() - n*24*60*60*1000).toISOString()

export const mockTypes: Type[] = [
  { id:1, type:'Electronics', status:true, createdAt: daysAgo(12) },
  { id:2, type:'Apparel', status:true, createdAt: daysAgo(10) },
  { id:3, type:'Home', status:false, createdAt: daysAgo(8) },
]

export const mockBrands: Brand[] = [
  { id:1, brandName:'Apple', itemTypeId:1, status:true, createdAt: daysAgo(9) },
  { id:2, brandName:'Samsung', itemTypeId:1, status:true, createdAt: daysAgo(7) },
  { id:3, brandName:'Uniqlo', itemTypeId:2, status:true, createdAt: daysAgo(6) },
]

export const mockItems: Item[] = [
  { id:1, itemName:'iPhone 15', itemBrandId:1, status:true, createdAt: daysAgo(6) },
  { id:2, itemName:'Galaxy S24', itemBrandId:2, status:true, createdAt: daysAgo(5) },
  { id:3, itemName:'AIRism Tee', itemBrandId:3, status:true, createdAt: daysAgo(4) },
]

export const mockQuantities: Quantity[] = [
  { id:1, itemId:1, inventoryId:1001, quantity:50, purchasePrice:800, status:true, createdAt: daysAgo(3), lotNumber:'L-IPH-001', expiryDate: daysAgo(-120) },
  { id:2, itemId:2, inventoryId:1002, quantity:40, purchasePrice:700, status:true, createdAt: daysAgo(2), lotNumber:'L-GAL-002', expiryDate: daysAgo(60) },
  { id:3, itemId:3, inventoryId:1003, quantity:120, purchasePrice:10, status:true, createdAt: daysAgo(1), lotNumber:'L-AIR-003', expiryDate: daysAgo(15) },
]

export const mockSales: Sale[] = [
  { id:1, itemQuantityId:1, inventoryId:1001, salePrice:999, status:true, createdAt: daysAgo(2) },
  { id:2, itemQuantityId:2, inventoryId:1002, salePrice:899, status:true, createdAt: daysAgo(1) },
  { id:3, itemQuantityId:3, inventoryId:1003, salePrice:19, status:true, createdAt: daysAgo(0) },
]

export const mockSuppliers: Supplier[] = [
  { id:1, name:'Acme Supply Co.', email:'acme@example.com', phone:'+1-555-0100', leadTimeDays:7, terms:'Net 30', rating:4.5, status:true, createdAt: daysAgo(14) },
  { id:2, name:'Global Traders', email:'global@example.com', phone:'+1-555-0110', leadTimeDays:10, terms:'Net 15', rating:4.2, status:true, createdAt: daysAgo(9) },
]

export const mockPOs: PurchaseOrder[] = [
  { id:10001, supplierId:1, status:'Approved', expectedDate: daysAgo(-3), notes:'Priority', createdAt: daysAgo(5) },
  { id:10002, supplierId:2, status:'Draft', expectedDate: daysAgo(2), notes:'Standard', createdAt: daysAgo(1) },
]

export const mockWarehouses: Warehouse[] = [
  { id:1, name:'Main DC', code:'DC1', status:true, createdAt: daysAgo(20) },
  { id:2, name:'City Hub', code:'HUB1', status:true, createdAt: daysAgo(15) },
]

export const mockBins: Bin[] = [
  { id:1, warehouseId:1, code:'A-01', zone:'A', status:true, createdAt: daysAgo(12) },
  { id:2, warehouseId:1, code:'A-02', zone:'A', status:true, createdAt: daysAgo(11) },
  { id:3, warehouseId:2, code:'Z-01', zone:'Z', status:true, createdAt: daysAgo(10) },
]

export const mockTransfers: Transfer[] = [
  { id:5001, fromWarehouseId:1, toWarehouseId:2, fromBinId:1, toBinId:3, itemId:1, quantity:5, notes:'Rebalance', createdAt: daysAgo(1) },
]

export const mockReturns: Return[] = [
  { id:9001, kind:'Customer', itemId:1, quantity:1, reason:'Damaged on arrival', status:'Requested', notes:'Box dented', createdAt: daysAgo(0) },
  { id:9002, kind:'Supplier', itemId:2, quantity:2, reason:'Over-shipped', status:'Approved', notes:'Return to sender', createdAt: daysAgo(3) },
]

export const mockCycleCounts: CycleCount[] = [
  { id:7001, warehouseId:1, scheduledDate: daysAgo(-1), status:'Planned', variance:0, createdAt: daysAgo(2) },
]

export const mockAdjustments: Adjustment[] = [
  { id:8001, itemId:1, quantity:-1, reason:'Damage', approved:true, createdAt: daysAgo(0) },
]
