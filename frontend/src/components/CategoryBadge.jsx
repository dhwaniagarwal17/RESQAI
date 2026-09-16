import { CATEGORIES } from '../utils/constants';

const CategoryBadge = ({ category }) => {
  const categoryColors = {
    caution_and_advice: 'bg-blue-100 text-blue-800',
    displaced_people_and_evacuations: 'bg-purple-100 text-purple-800',
    infrastructure_and_utility_damage: 'bg-orange-100 text-orange-800',
    injured_or_dead_people: 'bg-danger-100 text-danger-800',
    missing_or_found_people: 'bg-yellow-100 text-yellow-800',
    not_humanitarian: 'bg-gray-100 text-gray-800',
    other_relevant_information: 'bg-cyan-100 text-cyan-800',
    requests_or_urgent_needs: 'bg-danger-100 text-danger-800',
    rescue_volunteering_or_donation_effort: 'bg-success-100 text-success-800',
    sympathy_and_support: 'bg-pink-100 text-pink-800'
  };

  return (
    <span className={`badge ${categoryColors[category] || categoryColors.other_relevant_information}`}>
      {CATEGORIES[category] || category}
    </span>
  );
};

export default CategoryBadge;
