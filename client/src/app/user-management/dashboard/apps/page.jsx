'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import {AppsService } from '@/services/user-management/usermanagement';
import AppsList from '../../components/apps/appsList';
import AppsForm from '../../components/apps/appsForm';

const AppsPage = () => {
  const [loading, setLoading] = useState(true);
  const [appsList, setAppsList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 

  useEffect(() => {fetchApps(); }, []);
  const router = useRouter();

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await AppsService.list();
      setAppsList(response.data);
      
    } catch (err) {
      console.error(err);
      setError('Failed to load Apps');
    } finally { setLoading(false); }
  };

  const handleSave = async (data) => {
    try {
      setError('');
      if (editing) {
        alert('Edit functionality is currently disabled for apps.');
        // await AppsService.update(editing.id, data);
        // setAppsList((prev) => prev.map((it) => it.id === editing.id ? { ...it, ...data } : it));
        // setSuccess('Apps updated');
      } else {
        const resp = await AppsService.create(data);
        const newId = resp.data.id || Date.now();
        const newItem = { id: newId, ...data };
        setAppsList((prev) => [newItem, ...prev]);
        setSuccess('Apps created');
      }
      setShowForm(false);
      setEditing(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save apps');
    }
  };

  const handleEdit = (it) => { setEditing(it); setShowForm(true); window.scrollTo(0,0); };

  const handleDelete = async (id) => {
    alert('Delete functionality is currently disabled for apps.');
    // try {
    //   await AppsService.remove(id);
    //   setAppsList((prev) => prev.filter((i) => i.id !== id));
    //   setSuccess('Apps deleted');
    //   setTimeout(() => setSuccess(''), 3000);
    // } catch (err) {
    //   console.error(err);
    //   setError('Failed to delete apps');
    // }
  };

  return (
    <div className="p-2">
      <div className="card shadow-sm">
        <div className="card-header bg-light border-bottom">
          <h5 className="mb-0">एप्स प्रयोगकर्ता</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">एप्स सुचि</h6>
            <button className="btn btn-primary d-flex align-items-center" onClick={() => { setEditing(null); setShowForm(true); }}>
              <PlusCircle size={18} className="me-2 "/> Add
            </button>
          </div>
          {showForm && (
            <div>
              <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.35)', zIndex: 2990 }} onClick={() => { setShowForm(false); setEditing(null); }} aria-hidden />
              <div style={{ zIndex: 3000 }} className="position-fixed top-50 start-50 translate-middle">
                <div className="card shadow" style={{ minWidth: 520 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{editing ? 'Edit Committee' : 'Add New Committee'}</h6>
                      <button type="button" className="btn-close" onClick={() => { setShowForm(false); setEditing(null); }} />
                    </div>
                    <AppsForm  appsList={appsList} onSubmit={async (data) => { await handleSave(data); setShowForm(false); }} initialData={editing} onCancel={() => { setShowForm(false); setEditing(null); }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr />

          {loading ? (
            <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
          ) : (
            <>
              <AppsList data={appsList} onEdit={handleEdit} onDelete={handleDelete} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AppsPage;