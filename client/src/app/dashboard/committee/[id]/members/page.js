"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';

const CommitteeMembers = dynamic(() => import('@/components/committee/CommitteeMembers'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CommitteeMembersPage() {
  const { id } = useParams() || {};
  const router = useRouter();
  const [committee, setCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gender_stats, setGenderStats] = useState(null);

  useEffect(() => {
    if (id) fetchCommittee();
  }, [id]);

  const fetchCommittee = async () => {
    
    try {
      setLoading(true);
      // Fetch the committee including members
      const resp = await axios.get(`${API_URL}/committees/${id}/`); 
      const data = resp.data;
      if(resp.status == 200) {
        const get_gender_stat= await axios.get(`${API_URL}/committees/${id}/gender-stats/`);
        console.log("gender stats", get_gender_stat.data.male_count);
        setGenderStats(get_gender_stat.data)
      }

      // Map committee data to your frontend format
      const mapped = {
        id: data.id,
        reg_no: data.register_number ? data.register_number : `REG-${String(data.id).padStart(3,'0')}`,
        name: data.name,
        committee_type: data.committeeType?.name || 'General',
        address: data.address || 'Unknown',
        formation_date: data.created_date || '',
        members: data.members || [],  // include nested members
      };

      setCommittee(mapped);
    } catch (err) {
      console.error(err);
      setError('Failed to load committee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Members</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => router.push('/dashboard/committee/list')}>Back to Committees</button>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div className="text-center"><div className="spinner-border" role="status"/></div>
          ) : (
            committee ? (
              <CommitteeMembers 
                committee={committee} 
                gender_stats={gender_stats}
                apiBase={API_URL} 
                onClose={() => router.push('/dashboard/committee/list')} 
              />
            ) : (
              <div className="alert alert-info">Committee not found</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
