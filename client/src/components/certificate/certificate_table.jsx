'use client';
import { useState, useEffect } from "react";
import { Edit2, Trash2, MoreHorizontal, X } from "lucide-react";

export default function DataTable({ members }) {
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  // Initialize local state from props
  useEffect(() => {
    if (members?.length) {
      setCommitteeMembers(
        members.filter((m) => !m.is_monitoring_committee_member)
      );
    } else {
      setCommitteeMembers([]);
    }
  }, [members]);

  if (!committeeMembers.length) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No member data available.</p>
      </div>
    );
  }

  return (
    <div style={{ maxHeight: "57vh", overflowY: "auto", position: "relative" }}>
      <table className="table table-hover table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>क्र.स</th>
            <th>पद</th>
            <th>नाम</th>
            <th>लिङ्ग</th>
            <th>बुवाको नाम</th>
            <th>ठेगाना</th>
            <th>मोबाइल नं</th>
            <th>नागरिकता नं</th>
            
          </tr>
        </thead>
        <tbody>
          {committeeMembers.map((user, i) => (
            <tr key={user.id}>
              <td><strong>{i + 1}</strong></td>
              <td>{user.designation}</td>
              <td>{user.name}</td>
              <td>{user.sex_display}</td>
              <td>{user.father_name}</td>
              <td>{user.address}</td>
              <td>{user.mobile_number}</td>
              <td>{user.citizenship_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
