import React, { useState, useEffect } from 'react';
import { vaccinationApi } from '../../api/vaccinationApi';
import { VaccinationCard } from '../../components/cards/VaccinationCard';
import { TabView } from '../../components/common/TabView';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { Calendar, Syringe } from 'lucide-react';

export const OwnerVaccinationsPage = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVacs = async () => {
      setLoading(true);
      try {
        const data = await vaccinationApi.getVaccinations();
        setVaccinations(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVacs();
  }, []);

  const overdue = vaccinations.filter((v) => v.status === 'Overdue');
  const upcoming = vaccinations.filter((v) => v.status === 'Upcoming');

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Vaccination Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track immunizations, booster dates, and certification records for your pets.
          </p>
        </div>

        <Link to="/vets">
          <Button variant="primary" size="sm" icon={Calendar}>
            Book Vet Booster
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {overdue.map((vac) => (
          <VaccinationCard key={vac.id} vaccination={vac} />
        ))}
        {upcoming.map((vac) => (
          <VaccinationCard key={vac.id} vaccination={vac} />
        ))}
      </div>
    </div>
  );
};
