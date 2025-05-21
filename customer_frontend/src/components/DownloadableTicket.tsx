import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SimpleEvent } from '../services/api';
import { formatShortDate, formatTime } from '../utils/dateUtils';
import { Calendar, Clock, MapPin, Ticket, Users, CreditCard } from 'lucide-react';

interface DownloadableTicketProps {
  ticketId: string;
  event: SimpleEvent;
  ticketPrice: number;
  quantity: number;
}

const DownloadableTicket: React.FC<DownloadableTicketProps> = ({
  ticketId,
  event,
  ticketPrice,
  quantity,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ticket-${ticketId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={ticketRef}
        className="bg-gradient-to-br from-accent/5 to-primary/5 p-8 rounded-2xl border border-neutral-200"
        style={{ width: '800px', minHeight: '400px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-2">{event.title}</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{event.description}</p>
          </div>

          <div className="flex gap-8">
            {/* Left section - Event details */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-accent mr-2" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-neutral-600">Date</span>
                  </div>
                  <p className="text-lg font-semibold">{formatShortDate(event.date)}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-accent mr-2" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-neutral-600">Time</span>
                  </div>
                  <p className="text-lg font-semibold">{formatTime(event.date)}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-accent mr-2" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-neutral-600">Location</span>
                  </div>
                  <p className="text-lg font-semibold">{event.location}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-accent mr-2" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-neutral-600">Quantity</span>
                  </div>
                  <p className="text-lg font-semibold">{quantity} {quantity === 1 ? 'ticket' : 'tickets'}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 text-accent mr-2" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-neutral-600">Price Details</span>
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-600">Price per ticket: <span className="font-semibold">${ticketPrice}</span></p>
                  <p className="text-lg font-semibold text-accent">Total: ${ticketPrice * quantity}</p>
                </div>
              </div>
            </div>

            {/* Right section - QR Code */}
            <div className="w-72 flex flex-col items-center justify-between bg-white p-6 rounded-xl shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Ticket className="h-6 w-6 text-accent mr-2" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold">Scan to Verify</h3>
                </div>
                <div className="bg-white p-2 rounded-lg inline-block border border-neutral-100">
                  <QRCodeSVG
                    value={`ticket:${ticketId}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm font-medium text-neutral-600">Ticket ID:</p>
                <p className="text-sm font-mono text-neutral-500 break-all">{ticketId}</p>
                <p className="text-xs text-accent mt-2">Valid for one-time entry</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={downloadTicket}
          className="btn btn-primary px-8"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default DownloadableTicket; 