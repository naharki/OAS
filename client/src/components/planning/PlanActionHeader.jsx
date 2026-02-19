const PlanActionHeader = ({ planDetails }) => {
  return (
    <div className="p-4 border-b border-gray-300 mb-4">
        <h2 className="text-2xl font-bold mb-2">{planDetails.plan_name}</h2>
        <p className="text-gray-600">वडा नं: {planDetails.ward_number} |
            स्थान: {planDetails.location} | विनियोजित बजेट: {planDetails.allocated_budget}
            | दर्ता नं :{planDetails.registration_number} | मिति: {planDetails.date} | अवस्था: {planDetails.implementation_status}

        </p>
    </div>
  );
}   
export default PlanActionHeader;