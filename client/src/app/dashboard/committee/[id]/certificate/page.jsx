"use client";

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams } from 'next/navigation';
import axios from 'axios';
import Header from "@/components/certificate/letter_head";
import DataTable from "@/components/certificate/certificate_table";
import SignatureCao from "@/components/certificate/signature";
import CertificateEditor from '@/components/certificate/CertificateEditor';
import { OfficeService } from "@/services/officeServices";
import { CommitteeService } from "@/services/committeeService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PrintPage() {
  const params = useParams();
  const committeeId = params?.id;
  const printRef = useRef();
  const [initialData, setInitialData] = useState(null);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    if (!committeeId) return;
    (async () => {
      try {
        const resp = await CommitteeService.get(committeeId);
        const data = resp.data || {};
        setMembers(data.members || []); 
        const initial = {
          field1: new Date().toLocaleDateString(),
          field2: data.title || `Certificate for Committee ${committeeId}`,
          field3: 'Details',
          content: data.body || null,
          savedAt: null,
        };
        setInitialData(initial);
      } catch (err) {
        console.error('Failed to load certificate data', err);
        setInitialData({ field1: new Date().toLocaleDateString(), field2: `Certificate for Committee ${committeeId}`, field3: 'Details', content: null });
      }
    })();
  }, [committeeId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    contentRef: printRef,
    documentTitle: "Certificate",
  });

  return (
    <div className="container mt-5">

      <h2 className="mb-3">Print Example Page</h2>
      <button 
        className="btn btn-primary mb-4 d-print-none"
        onClick={handlePrint}
      >
        Print Page
      </button>

      {/* PRINTABLE AREA */}
      <div ref={printRef} className="border rounded p-4 print-area no-print-border">
        <Header />
        <h3 className="text-center mb-3">Predefined Data</h3>
        <CertificateEditor committeeId={committeeId} initialData={initialData} />
        <DataTable members= {members}/>
        <div className="mt-4">
         <SignatureCao />
        </div>
      </div>

      <style>{`
        @media print {
          .d-print-none { display: none !important; }
          .no-print-border { border: none !important; box-shadow: none !important; }
          body * { visibility: visible; }
          /* make only the print area visible (better ensure minimal chrome) */
          .no-print-border, .no-print-border * { visibility: visible; }
        }
      `}</style>
    </div>
  );
}