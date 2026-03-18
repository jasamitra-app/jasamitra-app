import React from 'react';
import { ArrowLeft, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface IncomingOrdersProps {
  mitraOrders: any[];
  handleBack: () => void;
  navigateTo: (page: any) => void;
  setChatMitra: (mitra: any) => void;
}

export function IncomingOrders({ mitraOrders, handleBack, navigateTo, setChatMitra }: IncomingOrdersProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Pesanan Masuk" onBack={handleBack} />
      
      <div className="p-4 space-y-4">
        {mitraOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Belum ada pesanan masuk.</p>
          </div>
        ) : (
          mitraOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{order.serviceTitle}</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-700' :
                  order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {order.status === 'completed' ? 'Selesai' :
                   order.status === 'paid' ? 'Dibayar' :
                   order.status === 'deal_agreed' ? 'Deal' :
                   order.status === 'offer_sent' ? 'Menunggu' : 'Baru'}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700"><span className="font-medium">Pelanggan:</span> {order.customerName}</p>
                {order.customerPhone && (
                  <p className="text-sm text-gray-700"><span className="font-medium">No. HP:</span> {order.customerPhone}</p>
                )}
                {order.address && (
                  <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Alamat:</span> {order.address}</p>
                )}
                {order.description && (
                  <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Catatan:</span> {order.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setChatMitra({
                      id: order.customerID,
                      name: order.customerName,
                      serviceTitle: order.serviceTitle,
                      serviceId: order.serviceID
                    });
                    navigateTo('chat-room');
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Pelanggan</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
