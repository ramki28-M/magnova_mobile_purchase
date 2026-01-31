import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export const ProcurementPage = () => {
  const [records, setRecords] = useState([]);
  const [pos, setPOs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    po_number: '',
    vendor_name: '',
    store_location: '',
    imei: '',
    serial_number: '',
    device_model: '',
    purchase_price: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchPOs();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/procurement');
      setRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch procurement records');
    }
  };

  const fetchPOs = async () => {
    try {
      const response = await api.get('/purchase-orders');
      const approved = response.data.filter((po) => po.approval_status === 'Approved');
      setPOs(approved);
    } catch (error) {
      console.error('Error fetching POs:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/procurement', {
        ...formData,
        purchase_price: parseFloat(formData.purchase_price),
      });
      toast.success('Procurement record created successfully');
      setDialogOpen(false);
      setFormData({
        po_number: '',
        vendor_name: '',
        store_location: '',
        imei: '',
        serial_number: '',
        device_model: '',
        purchase_price: '',
      });
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create record');
    }
  };

  return (
    <Layout>
      <div data-testid="procurement-page">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Procurement</h1>
            <p className="text-slate-600 mt-1">Record device procurement with IMEI tracking</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="create-procurement-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Procurement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Procurement Record</DialogTitle>
                <DialogDescription>Record new device procurement</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4" data-testid="procurement-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>PO Number</Label>
                    <Select value={formData.po_number} onValueChange={(value) => setFormData({ ...formData, po_number: value })} required>
                      <SelectTrigger data-testid="po-select">
                        <SelectValue placeholder="Select PO" />
                      </SelectTrigger>
                      <SelectContent>
                        {pos.map((po) => (
                          <SelectItem key={po.po_number} value={po.po_number}>
                            {po.po_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Vendor Name</Label>
                    <Input
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                      required
                      data-testid="vendor-input"
                    />
                  </div>
                  <div>
                    <Label>Store Location</Label>
                    <Input
                      value={formData.store_location}
                      onChange={(e) => setFormData({ ...formData, store_location: e.target.value })}
                      required
                      data-testid="location-input"
                    />
                  </div>
                  <div>
                    <Label>Device Model</Label>
                    <Input
                      value={formData.device_model}
                      onChange={(e) => setFormData({ ...formData, device_model: e.target.value })}
                      required
                      data-testid="model-input"
                    />
                  </div>
                  <div>
                    <Label>IMEI Number</Label>
                    <Input
                      value={formData.imei}
                      onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                      required
                      data-testid="imei-input"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label>Serial Number</Label>
                    <Input
                      value={formData.serial_number}
                      onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                      data-testid="serial-input"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label>Purchase Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      data-testid="price-input"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" data-testid="submit-procurement">
                  Add Procurement Record
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="procurement-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IMEI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Device Model</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No procurement records found
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.procurement_id} className="table-row border-b border-slate-100" data-testid="procurement-row">
                      <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{record.po_number}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">{record.imei}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{record.device_model}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{record.vendor_name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{record.store_location}</td>
                      <td className="px-4 py-3 text-sm text-right text-slate-900">₹{record.purchase_price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{new Date(record.procurement_date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
