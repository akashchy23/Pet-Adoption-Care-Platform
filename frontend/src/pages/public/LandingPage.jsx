import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  MapPin,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
  Award,
  Search,
  Activity,
  Utensils
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PetCard } from '../../components/cards/PetCard';
import { VetCard } from '../../components/cards/VetCard';
import { ArticleCard } from '../../components/cards/ArticleCard';
import { petApi } from '../../api/petApi';
import { appointmentApi } from '../../api/appointmentApi';
import { learningApi } from '../../api/learningApi';
import { reportApi } from '../../api/reportApi';

export const LandingPage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalPets: 184,
    successfulAdoptions: 86,
    totalShelters: 14,
    totalVeterinarians: 32
  });

  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Load dynamic data
    const loadLandingData = async () => {
      try {
        const [petsRes, vetsRes, articlesRes, metricsRes] = await Promise.all([
          petApi.getFeaturedPets(),
          appointmentApi.getVets({ limit: 3 }),
          learningApi.getArticles({ limit: 3 }),
          reportApi.getAdminMetrics()
        ]);
        setFeaturedPets(petsRes || []);
        setVets(vetsRes?.slice(0, 3) || []);
        setArticles(articlesRes?.slice(0, 3) || []);
        if (metricsRes?.summary) {
          setStats(metricsRes.summary);
        }
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      }
    };

    loadLandingData();
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.hero-headline', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        delay: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.hero-subtext', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out'
      });

      if (heroImageRef.current) {
        gsap.from(heroImageRef.current, {
          opacity: 0,
          scale: 0.92,
          y: 40,
          duration: 1.1,
          delay: 0.3,
          ease: 'power3.out'
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-14 overflow-hidden" ref={heroRef}>
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-10 lg:pt-12 lg:pb-14">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none hero-glow -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-heading">
                Give Every Pet a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Loving Home</span> & Lifelong Care.
              </h1>

              <p className="hero-subtext text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect seamlessly with verified rescue shelters, smart AI breed recommendations, digital health passports, veterinary appointments, and lost & found recovery.
              </p>

              <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/pets" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={Heart} className="w-full sm:w-auto shadow-lg shadow-teal-600/25">
                    Find a Pet to Adopt
                  </Button>
                </Link>
                <Link to="/recommendations" className="w-full sm:w-auto">
                  <Button variant="amber" size="lg" icon={Sparkles} className="w-full sm:w-auto">
                    Try AI Matchmaker
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Verified Rescue Shelters
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" /> Digital Health Passport
                </span>
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" /> Certified Veterinarians
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative" ref={heroImageRef}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Pet Image Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/5 relative">
                  <img
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80"
                    alt="Golden Retriever rescue dog"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 font-bold text-xs">
                      Ready for Adoption
                    </span>
                    <h3 className="text-2xl font-bold font-heading mt-2">Meet Toby</h3>
                    <p className="text-xs text-slate-200">2 yrs • Golden Mix • Seattle Shelter</p>
                  </div>
                </div>

                {/* Floating Microchip Badge */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Vaccinated & Chipped</p>
                    <p className="text-xs font-bold text-slate-900">100% Health Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={statsRef}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl">
          <div className="text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-teal-600 font-heading">
              {stats.availablePets || 98}+
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Pets Available</p>
            <p className="text-[11px] text-slate-400">Awaiting warm homes</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100">
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-600 font-heading">
              {stats.successfulAdoptions || 86}+
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Adoptions</p>
            <p className="text-[11px] text-slate-400">Rehomed successfully</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100">
            <h3 className="text-3xl sm:text-4xl font-black text-amber-500 font-heading">
              {stats.totalVeterinarians || 32}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Veterinarians</p>
            <p className="text-[11px] text-slate-400">Certified doctors</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              {stats.totalShelters || 14}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Partner Shelters</p>
            <p className="text-[11px] text-slate-400">Verified sanctuaries</p>
          </div>
        </div>
      </section>

      {/* FEATURED PETS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
              Meet Your Future Family Member
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
              Featured Pets for Adoption
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Every pet is medically screened, vaccinated, and microchipped before rehoming.
            </p>
          </div>
          <Link to="/pets">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              View All Pets
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      {/* 4-STEP HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-12 sm:py-14 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            How Adoption Works on PetHaven
          </h2>
          <p className="text-sm text-slate-400">
            Our streamlined process ensures the best match for both pet and adopter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Find & Match', desc: 'Browse curated listings or use our AI matchmaker based on your lifestyle.' },
            { step: '02', title: 'Submit Application', desc: 'Complete the adoption questionnaire directly online with shelter review.' },
            { step: '03', title: 'Meet & Greet', desc: 'Meet your prospective pet, verify compatibility, and complete home verification.' },
            { step: '04', title: 'Digital Passport', desc: 'Welcome your new companion with their lifelong digital health passport and vaccination schedule.' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 text-left relative">
              <span className="text-3xl font-black text-teal-400/40 font-heading block">{item.step}</span>
              <h3 className="text-lg font-bold text-white font-heading">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI RECOMMENDATION SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-left">
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              Not sure which pet is right for your home?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Take our interactive 60-second quiz. Our matching algorithm evaluates living space, family composition, activity habits, and budget to recommend the most compatible breeds.
            </p>
            <div className="pt-2">
              <Link to="/recommendations">
                <Button variant="amber" size="lg" icon={Sparkles}>
                  Launch AI Matchmaker
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <p className="text-2xl font-black text-teal-300">98%</p>
              <p className="text-xs text-slate-300 mt-0.5">Match Accuracy</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <p className="text-2xl font-black text-amber-300">&lt; 1 min</p>
              <p className="text-xs text-slate-300 mt-0.5">Quick Evaluation</p>
            </div>
          </div>
        </div>
      </section>

      {/* VETERINARIANS & APPOINTMENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
              Certified Veterinary Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
              Find & Book Expert Veterinarians
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Book routine checkups, dental triage, emergency consultations, and vaccinations with top-rated clinics.
            </p>
          </div>
          <Link to="/vets">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              Explore All Veterinarians
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <VetCard key={vet.id} vet={vet} onBookClick={() => (window.location.href = '/vets')} />
          ))}
        </div>
      </section>

      {/* LEARNING HUB GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
              Pet Care Knowledge Base
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
              Pet Care Learning Hub
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Evidence-based guides on puppy acclimation, feline body language, core vaccines, and nutrition.
            </p>
          </div>
          <Link to="/learning">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              View Learning Hub
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* COMMUNITY & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-teal-50 border border-teal-100 text-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-slate-900">
              Joyful Adoption Stories
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Join thousands of pet owners sharing tips, milestones, and heartwarming second chances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                name: 'Alex Morgan',
                role: 'Adopted Luna (Golden Retriever)',
                text: 'PetHaven made the entire adoption process transparent. Having her vaccination history and digital passport in my pocket gives me total peace of mind on trails.'
              },
              {
                name: 'Sarah Jenkins',
                role: 'Cat Parent & Owner',
                text: 'Booking Dr. Sophia Patel for Milo’s annual dental check took 30 seconds. The reminders for rabies boosters are a lifesaver!'
              },
              {
                name: 'Michael Scott',
                role: 'Happy Paws Rescue Manager',
                text: 'Managing pet intake, tracking vaccination schedules, and approving applications has never been this seamless. Our rehoming rate rose by 35%.'
              }
            ].map((test, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed italic">"{test.text}"</p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{test.name}</p>
                  <p className="text-[11px] text-teal-700 font-semibold">{test.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/community">
              <Button variant="primary" size="md">
                Visit Community Forum
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
