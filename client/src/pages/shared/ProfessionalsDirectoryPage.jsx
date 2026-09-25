import React, { useState, useEffect } from 'react';
import { Users, Search, Award, MapPin, Mail, Phone, Palette, Hammer } from 'lucide-react';
import { usersAPI } from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import SearchBar from '../../components/common/SearchBar';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const ProfessionalsDirectoryPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getProfessionals({
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      });
      if (res.data?.data) {
        setProfessionals(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [roleFilter]);

  const filtered = professionals.filter((p) => {
    if (!search) return true;
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchLoc = p.location?.toLowerCase().includes(search.toLowerCase());
    return matchName || matchLoc;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
          Curated Professionals Network
        </h1>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
          Explore certified interior design ateliers, architects, and master building contractors.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by professional name or city..."
        />

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-charcoal-900 border border-sky-400/20 shrink-0">
          {['ALL', 'DESIGNER', 'CONTRACTOR'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === role
                  ? 'sky-gradient-btn text-white font-bold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {role === 'ALL' ? 'All Network' : role === 'DESIGNER' ? 'Designers' : 'Contractors'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner text="Searching professional network..." />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-700 dark:text-slate-300 font-medium glass-card">
          No professionals found matching the search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pro) => (
            <GlassCard key={pro._id} className="p-6 flex flex-col justify-between gap-4 border-sky-400/20">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={pro.profileImage} name={pro.name} size="md" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 dark:text-white">{pro.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant={pro.role === 'DESIGNER' ? 'sky' : 'indigo'} size="sm">
                          {pro.role}
                        </Badge>
                        {pro.isVerified && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5 font-bold">
                            <Award className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-3 leading-relaxed">
                  {pro.bio || 'Specialized interior design and fit-out professional with deep domain experience.'}
                </p>
              </div>

              <div className="pt-3 border-t border-sky-400/10 flex flex-col gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {pro.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>{pro.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="truncate">{pro.email}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalsDirectoryPage;
