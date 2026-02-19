'use client';

import { useEffect, useState } from 'react';
import PlanList from '../../../../components/planning/PlanList';
import axios from 'axios';
import { plansService } from '@/services/planServices';


export default function PlanPage() {
  const [plans, setPlans]= useState([]);
  const [loading, setLoading]= useState(true);
  const [error, setError]= useState('');
  const [editing, setEditing] = useState(null);

  const getData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await plansService.list();
      setPlans(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetched Data")
    } finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    getData();
  },[])


  return (
    <div className="p-3">
      <PlanList data={plans} error={error}  loading={loading} onSuccess={getData} />
    </div>
  );
}
