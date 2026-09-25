import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, Heart, Shield, DollarSign, Home, Activity, RefreshCw } from 'lucide-react';
import { recommendationApi } from '../../api/recommendationApi';
import { Button } from '../common/Button';
import { PetCard } from '../cards/PetCard';
import { Link } from 'react-router-dom';

export const AIRecommendationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [criteria, setCriteria] = useState({
    homeType: 'Apartment',
    familySize: '2 people',
    hasChildren: 'no',
    lifestyle: 'moderate',
    preferredSpecies: 'Dog',
    firstTimeOwner: 'no',
    monthlyBudget: '$150 - $250'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelect = (field, value) => {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCalculate();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await recommendationApi.getPetRecommendations(criteria);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-100 p-6 sm:p-10 shadow-xl">
      {!result && !loading && (
        <div>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              AI-Powered Matchmaker
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Find Your Ideal Pet Companion
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Answer 4 quick lifestyle questions to discover breeds and pets with the highest compatibility score.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Living Space */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800">
                1. What is your living environment?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Apartment / Flat', desc: 'No private yard, indoor space', value: 'Apartment' },
                  { title: 'House with Yard', desc: 'Secure fenced outdoor area', value: 'House with Yard' },
                  { title: 'Condo / Townhouse', desc: 'Shared greenspace & patios', value: 'Condo' },
                  { title: 'Rural / Acreage', desc: 'Abundant open outdoor space', value: 'Farm' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelect('homeType', item.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      criteria.homeType === item.value
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      {criteria.homeType === item.value && (
                        <Check className="w-4 h-4 text-teal-600 font-bold" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Family Structure */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800">
                2. Who lives in your household?
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Living Alone / Individual', desc: 'Solo guardian with focused bond', value: 'Solo' },
                  { title: 'Adult Couple / Roommates', desc: 'Multiple adult caregivers', value: 'Couple' },
                  { title: 'Family with Young Children (< 8 yrs)', desc: 'Needs highly patient & gentle pet', value: 'Kids' },
                  { title: 'Family with Older Teens', desc: 'Active collaborative household', value: 'Teens' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      handleSelect('familySize', item.value);
                      handleSelect('hasChildren', item.value === 'Kids' ? 'yes' : 'no');
                    }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      criteria.familySize === item.value
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    {criteria.familySize === item.value && (
                      <Check className="w-5 h-5 text-teal-600 font-bold" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Activity Level */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800">
                3. What is your daily activity level and schedule?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Relaxed & Cozy', desc: 'Short calm walks, lots of indoor relaxation', value: 'relaxed' },
                  { title: 'Moderate Activity', desc: '1-2 daily walks, weekend park outings', value: 'moderate' },
                  { title: 'High Energy / Runner', desc: 'Trail hiking, jogging, rigorous play', value: 'active' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelect('lifestyle', item.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      criteria.lifestyle === item.value
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    {criteria.lifestyle === item.value && (
                      <Check className="w-4 h-4 text-teal-600 font-bold self-end mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Species, Budget & Experience */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800">
                4. Species preference & pet experience
              </h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Preferred Species
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Dog', 'Cat', 'Rabbit', 'Bird'].map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => handleSelect('preferredSpecies', sp)}
                      className={`p-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                        criteria.preferredSpecies === sp
                          ? 'border-teal-500 bg-teal-50 text-teal-800'
                          : 'border-slate-100 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Are you a first-time pet guardian?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Yes, First Time', value: 'yes' },
                    { label: 'No, Experienced', value: 'no' }
                  ].map((exp) => (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => handleSelect('firstTimeOwner', exp.value)}
                      className={`p-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                        criteria.firstTimeOwner === exp.value
                          ? 'border-teal-500 bg-teal-50 text-teal-800'
                          : 'border-slate-100 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              Back
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={currentStep === totalSteps ? Sparkles : ArrowRight}
              iconPosition="right"
              onClick={handleNext}
            >
              {currentStep === totalSteps ? 'Calculate AI Match' : 'Continue'}
            </Button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-50 border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Analyzing Compatibility Matrix...
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Comparing behavioral temperament, space suitability, and care complexity against registered shelter profiles.
          </p>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Result Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
                  Top Recommended Match
                </span>
                <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{result.matchScore}% Match Score</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {result.recommendedBreed}
                </h3>
                <p className="text-xs text-teal-200/90 mt-1">
                  Care Difficulty: <span className="font-bold text-white">{result.careDifficulty}</span> • Estimated Monthly Cost: <span className="font-bold text-white">{result.estimatedCost}</span>
                </p>
              </div>

              {/* Reasons */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
                  Why this is your ideal match:
                </p>
                <ul className="space-y-1.5">
                  {result.reasons?.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommended Pet Showcase */}
          {result.recommendedPet && (
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Featured Pet Available for Adoption:
              </h4>
              <PetCard pet={result.recommendedPet} />
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link to="/pets" className="w-full sm:flex-1">
              <Button variant="primary" size="md" className="w-full">
                Browse All Available Pets
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
