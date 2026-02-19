'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { ChalaniService } from '@/services/darta-chalani/dartaChalaniServices';
import ChalaniList from '../../components/chalani/chalaniList';
import ChalaniForm from '../../components/chalani/chalaniForm';

const Chalani = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchItems(); }, []);
  const router = useRouter();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await ChalaniService.list();
      console.log(response.data);
      setItems(response.data);
      
    } catch (err) {
      console.error(err);
      setError('Failed to load Chalani');
    } finally { setLoading(false); }
  };

  const handleSave = async (data) => {
    try {
      setError('');
      if (editing) {
        await ChalaniService.update(editing.id, data);
        setItems((prev) => prev.map((it) => it.id === editing.id ? { ...it, ...data } : it));
        setSuccess('Chalani updated');
      } else {
        const resp = await ChalaniService.create(data);
        const newId = resp.data.id || Date.now();
        const newItem = { id: newId, ...data };
        setItems((prev) => [newItem, ...prev]);
        setSuccess('Chalani created');
      }
      setShowForm(false);
      setEditing(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save Chalani');
    }
  };

  const handleEdit = (it) => { setEditing(it); setShowForm(true); window.scrollTo(0,0); };

  const handleDelete = async (id) => {
    try {
      await ChalaniService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSuccess('Chalani deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete Chalani');
    }
  };

  return (
    <div className="p-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light border-bottom">
          <h5 className="mb-0">चलानी किताव</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">चलानी सुचि</h6>
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
                    <ChalaniForm onSubmit={async (data) => { await handleSave(data); setShowForm(false); }} initialData={editing} onCancel={() => { setShowForm(false); setEditing(null); }} />
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
              <ChalaniList data={items} onEdit={handleEdit} onDelete={handleDelete} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chalani;