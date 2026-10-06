import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import CategoryBadge from '../../components/CategoryBadge';
import StatusBadge from '../../components/StatusBadge';
import UrgencyBadge from '../../components/UrgencyBadge';
import { CATEGORIES, STATUS, URGENCY } from '../../utils/constants';

const Incidents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    urgency: searchParams.get('urgency') || '',
    status: searchParams.get('status') || '',
    search: ''
  });

  useEffect(() => {
    loadIncidents();
  }, [searchParams]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.urgency) params.urgency = filters.urgency;
      if (filters.status) params.status = filters.status;

      const response = await adminAPI.getIncidents(params);
      setIncidents(response.data.data.incidents);
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = {};
    if (newFilters.category) params.category = newFilters.category;
    if (newFilters.urgency) params.urgency = newFilters.urgency;
    if (newFilters.status) params.status = newFilters.status;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: '', urgency: '', status: '', search: '' });
    setSearchParams({});
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        incident.message.toLowerCase().includes(search) ||
        incident.reporter?.name?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Incidents
          </h1>
          <p className="text-gray-600">
            Monitor and manage all reported incidents
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input pl-10"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency
              </label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="input"
              >
                <option value="">All Urgencies</option>
                {Object.entries(URGENCY).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">All Statuses</option>
                {Object.entries(STATUS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {(filters.category || filters.urgency || filters.status) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Loading incidents..." />
        ) : filteredIncidents.length === 0 ? (
          <EmptyState
            title="No incidents found"
            message="Try adjusting your filters"
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''}
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Incident
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIncidents.map((incident) => (
                      <tr key={incident._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {incident.message}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(incident.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CategoryBadge category={incident.category} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {incident.urgency ? (
                            <UrgencyBadge urgency={incident.urgency} />
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={incident.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${incident.modelUsed === 'BERTweet' ? 'bg-primary-100 text-primary-800' : 'bg-purple-100 text-purple-800'}`}>
                            {incident.modelUsed}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {(incident.confidence * 100).toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {incident.reporter?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/admin/incidents/${incident._id}`}
                            className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Incidents;
