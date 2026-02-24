import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Globe, GraduationCap, Users, TrendingUp, BookOpen, Award, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { getUniversityByShortName } from '@/data/universityMarks';
import { getUniversityFacultiesData, getTotalFacultiesCount, getTotalSpecialtiesCount, Faculty, Specialty, Institute } from '@/data/universityFaculties';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface University {
  id: string;
  short_name: string;
  full_name: string;
  city: string;
  website: string | null;
  description: string | null;
}

interface AdmissionStat {
  id: string;
  year: number;
  min_score: number | null;
  avg_score: number | null;
  budget_places: number | null;
  paid_places: number | null;
  paid_min_score?: number | null;
  specialty_id: string;
  specialty: { name: string; code: string | null } | null;
}

// University images mapping - проверенные фотографии университетов
const universityImages: Record<string, string> = {
  'БГУ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Belarus-Minsk-BSU-Rector%27s_Office-2.jpg/1280px-Belarus-Minsk-BSU-Rector%27s_Office-2.jpg',
  'БГУИР': '/pics/bsuir.jpg',
  'БНТУ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Main_building_of_BNTU.jpg/1280px-Main_building_of_BNTU.jpg',
  'БГЭУ': '/pics/bseu.jpg',
  'БГМУ': '/pics/bsmu.jpg',
  'БГПУ': '/pics/bspu.jpg',
  'ГрГУ': '/pics/uniofgrodno.jpg',
  'ВГУ': '/pics/vsu.jpg',
  'ПГУ': '/pics/pgu.jpg',
  'ГГТУ': '/pics/gstu.jpg',
  'БГУИЯ': '/pics/bsufl.jpg',
  'Академия управления': '/pics/akademiaupr.jpg',
  'Академия МВД': '/pics/akademiamvd.jpg',
  'БрГУ': '/pics/brsu.jpg',
  'БГАА': '/pics/bsaa.jpg',
  'БГУКИ': '/pics/bsuca.jpg',
  'БГУФК': '/pics/bsups.jpg',
};

// Extended descriptions for universities
const universityDescriptions: Record<string, string> = {
  'БГУ': 'Белорусский государственный университет — ведущий классический университет Республики Беларусь, основанный в 1921 году. Входит в топ-500 лучших университетов мира по рейтингу QS. Университет готовит специалистов по 250+ специальностям в области естественных наук, IT, экономики, права и гуманитарных дисциплин. БГУ является крупнейшим научным центром страны с развитой инфраструктурой и международными партнёрствами.',
  'БГУИР': 'Белорусский государственный университет информатики и радиоэлектроники — ведущий технический университет в сфере IT и радиоэлектроники. Основан в 1964 году. Университет готовит высококвалифицированных специалистов для IT-индустрии, телекоммуникаций и высокотехнологичных производств. Выпускники БГУИР востребованы в крупнейших IT-компаниях мира.',
  'БНТУ': 'Белорусский национальный технический университет — крупнейший технический вуз страны, основанный в 1920 году. Готовит инженеров по всем ключевым отраслям: машиностроение, строительство, энергетика, транспорт, IT. Университет имеет современную лабораторную базу и тесные связи с промышленными предприятиями.',
  'БГЭУ': 'Белорусский государственный экономический университет — ведущий экономический вуз страны. Готовит специалистов в области экономики, финансов, маркетинга, менеджмента и международных отношений. Университет активно развивает международное сотрудничество и программы двойных дипломов.',
  'БГМУ': 'Белорусский государственный медицинский университет — главный медицинский вуз страны, основанный в 1921 году. Готовит врачей всех основных специальностей. Университет оснащён современными симуляционными центрами и клиническими базами. Диплом БГМУ признаётся в более чем 50 странах мира.',
  'БГПУ': 'Белорусский государственный педагогический университет имени Максима Танка — ведущий педагогический вуз страны. Готовит учителей, воспитателей, психологов и специалистов в области образования. Университет реализует инновационные образовательные программы и активно внедряет современные педагогические технологии.',
  'ГрГУ': 'Гродненский государственный университет имени Янки Купалы — крупнейший вуз Гродненской области и один из ведущих университетов Беларуси. Готовит специалистов в области естественных наук, гуманитарных дисциплин, экономики и педагогики. Университет активно развивает международное сотрудничество и научные исследования.',
  'ВГУ': 'Витебский государственный университет имени П.М. Машерова — крупнейший вуз Витебской области. Готовит специалистов в области педагогики, гуманитарных наук, техники и технологий. Университет известен своими традициями в подготовке высококвалифицированных кадров для региона.',
  'ПГУ': 'Полоцкий государственный университет имени Евфросинии Полоцкой — современный вуз с богатыми историческими традициями. Готовит специалистов в области инженерии, экономики и педагогики. Университет активно сотрудничает с промышленными предприятиями региона.',
  'ГГТУ': 'Гомельский государственный технический университет имени П.О. Сухого — ведущий технический вуз Гомельской области. Специализируется на подготовке инженерных кадров для машиностроения, электроники и автоматизации. Университет имеет современные лаборатории и учебные центры.',
  'БГУИЯ': 'Минский государственный лингвистический университет (БГУИЯ) — ведущий вуз страны в области лингвистики и межкультурной коммуникации. Готовит высококвалифицированных переводчиков, преподавателей иностранных языков и специалистов в области международных отношений.',
  'Академия управления': 'Академия управления при Президенте Республики Беларусь — ведущий вуз в области государственного управления. Готовит высококвалифицированных управленцев для органов государственной власти и местного самоуправления. Академия известна высокими требованиями к поступающим.',
  'Академия МВД': 'Академия Министерства внутренних дел Республики Беларусь — специализированный вуз для подготовки кадров правоохранительных органов. Готовит офицеров милиции, следователей и специалистов в области юриспруденции и безопасности.',
  'БрГУ': 'Брестский государственный университет имени А.С. Пушкина — крупнейший вуз Брестской области. Готовит специалистов в области педагогики, гуманитарных наук, естественных наук и техники. Университет активно развивает международное сотрудничество с европейскими вузами.',
  'БГАА': 'Белорусская государственная академия авиации — специализированный вуз для подготовки авиационных специалистов. Готовит пилотов, авиационных инженеров, диспетчеров и специалистов по авиационной безопасности. Академия имеет современные авиационные тренажёры.',
  'БГУКИ': 'Белорусский государственный университет культуры и искусств — ведущий вуз в области культуры и искусства. Готовит актёров, режиссёров, музыкантов, хореографов и специалистов по управлению культурой. Университет известен своими творческими коллективами.',
  'БГУФК': 'Белорусский государственный университет физической культуры — специализированный вуз для подготовки специалистов в области физической культуры и спорта. Готовит тренеров, учителей физкультуры, спортивных менеджеров и специалистов по адаптивной физкультуре.',
};

const UniversityDetail = () => {
  const { shortName } = useParams<{ shortName: string }>();
  const decodedShortName = shortName ? decodeURIComponent(shortName) : '';
  const [university, setUniversity] = useState<University | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [admissionStats, setAdmissionStats] = useState<AdmissionStat[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUniversity() {
      if (!decodedShortName) return;

      try {
        // Try to load from Supabase first
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .select('*')
          .eq('short_name', decodedShortName)
          .single();

        if (universityError) {
          console.error('Error loading university from Supabase:', universityError);
          // Fallback to static data
          loadStaticData();
          return;
        }

        if (universityData) {
          setUniversity(universityData);

          // Load faculties
          const { data: facultiesData, error: facultiesError } = await supabase
            .from('faculties')
            .select('*')
            .eq('university_id', universityData.id);

          if (!facultiesError && facultiesData) {
            setFaculties(facultiesData);
          }

          // Load institutes
          const { data: institutesData, error: institutesError } = await supabase
            .from('institutes')
            .select('*')
            .eq('university_id', universityData.id);

          if (!institutesError && institutesData) {
            setInstitutes(institutesData as unknown as Institute[]);
          }

          // Load specialties
          const { data: specialtiesData, error: specialtiesError } = await supabase
            .from('specialties')
            .select('*')
            .or(`faculty_id.in.(${(facultiesData || []).map(f => f.id).join(',')}),institute_id.in.(${(institutesData || []).map(i => i.id).join(',')})`);

          if (!specialtiesError && specialtiesData) {
            setSpecialties(specialtiesData);
          }

          // Load admission stats
          const facultyIds = (facultiesData || []).map(f => f.id);
          const instituteIds = (institutesData || []).map(i => i.id);
          const specialtyIds = (specialtiesData || []).map(s => s.id);
          
          if (specialtyIds.length > 0) {
            const { data: admissionData, error: admissionError } = await supabase
              .from('admission_stats')
              .select('*')
              .in('specialty_id', specialtyIds)
              .order('year', { ascending: false });

            if (!admissionError && admissionData) {
              // Join with specialty names
              const admissionWithSpecialty = admissionData.map(stat => {
                const specialty = specialtiesData?.find(s => s.id === stat.specialty_id);
                return {
                  ...stat,
                  specialty: specialty ? { name: specialty.name, code: specialty.code } : null
                };
              });
              setAdmissionStats(admissionWithSpecialty);
            }
          }
        } else {
          // Fallback to static data
          loadStaticData();
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
        // Fallback to static data
        loadStaticData();
      }

      setLoading(false);
    }

    function loadStaticData() {
      const staticData = getUniversityFacultiesData(decodedShortName);
      const staticUniversity = getUniversityByShortName(decodedShortName);

      if (staticData) {
        setFaculties(staticData.faculties);
        setInstitutes(staticData.institutes || []);
        setSpecialties(staticData.specialties);
      }

      if (staticUniversity) {
        setUniversity({
          id: staticUniversity.id,
          short_name: staticUniversity.short_name,
          full_name: staticUniversity.full_name,
          city: staticUniversity.city,
          website: staticUniversity.website || null,
          description: null
        });
      }

      // Load admission stats from Supabase using static specialty IDs
      if (staticData && staticData.specialties.length > 0) {
        const specialtyIds = staticData.specialties.map(s => s.id);
        supabase
          .from('admission_stats')
          .select('*')
          .in('specialty_id', specialtyIds)
          .order('year', { ascending: false })
          .then(({ data }) => {
            if (data) {
              const admissionWithSpecialty = data.map(stat => {
                const specialty = staticData.specialties.find(s => s.id === stat.specialty_id);
                return {
                  ...stat,
                  specialty: specialty ? { name: specialty.name, code: specialty.code } : null
                };
              });
              setAdmissionStats(admissionWithSpecialty);
            }
          });
      }
    }

    fetchUniversity();
  }, [decodedShortName]);

  const heroImage = university ? universityImages[university.short_name] || universityImages['БГУ'] : '';
  const extendedDescription = university ? universityDescriptions[university.short_name] : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="pt-24 pb-16">
          <div className="section-container">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="pt-24 pb-16">
          <div className="section-container text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Университет не найден
            </h1>
            <p className="text-muted-foreground mb-8">
              К сожалению, информация о данном университете отсутствует.
            </p>
            <Link to="/applicants">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к списку
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="pt-20 pb-16">
        {/* Hero Image */}
        <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden bg-gray-200">
          <img 
            src={heroImage} 
            alt={university.full_name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback to local image or placeholder if external image fails
              const target = e.target as HTMLImageElement;
              target.src = '/pics/placeholder-university.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="section-container">
              <Link 
                to="/applicants" 
                className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к списку
              </Link>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-green-900 mb-2">
                {university.short_name}
              </h1>
              <p className="text-lg md:text-xl text-green-900">
                {university.full_name}
              </p>
            </div>
          </div>
        </div>

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
                <MapPin className="w-4 h-4" />
                <span>{university.city}</span>
              </div>
              
              {university.website && (
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Сайт</span>
                </a>
              )}

              {admissionStats.length > 0 && (
                <a 
                  href="#admission-stats" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Баллы</span>
                </a>
              )}
              
              <Badge variant="outline" className="px-4 py-2">
                <GraduationCap className="w-4 h-4 mr-2" />
                {faculties.length} факультетов
              </Badge>
              
              {institutes.length > 0 && (
                <Badge variant="outline" className="px-4 py-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {institutes.length} институтов
                </Badge>
              )}
              
              <Badge variant="outline" className="px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                {specialties.length} специальностей
              </Badge>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>О университете</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {extendedDescription || university.description || 'Информация о университете загружается...'}
                </p>
              </CardContent>
            </Card>

            {/* Faculties */}
            {faculties.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Факультеты ({faculties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {faculties.map(faculty => {
                      const facultySpecialties = specialties.filter(s => s.faculty_id === faculty.id);
                      const isExpanded = expandedFaculty === faculty.id;
                      
                      return (
                        <div 
                          key={faculty.id} 
                          className="border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaculty(isExpanded ? null : faculty.id)}
                            className="w-full p-4 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <h4 className="font-medium text-foreground">{faculty.name}</h4>
                                {faculty.code && (
                                  <span className="text-xs text-muted-foreground">({faculty.code})</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {faculty.id === 'bsuir-9' ? 'Подготовка к ЦТ/ЦЭ' : `${facultySpecialties.length} специальностей`}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t bg-background"
                            >
                              <div className="p-4">
                                {faculty.id === 'bsuir-9' ? (
                                  <div className="text-sm text-muted-foreground">
                                    <p className="mb-2">Факультет доуниверситетской подготовки и профессиональной ориентации (ФДПиПО) занимается подготовкой абитуриентов к вступительным экзаменам (ЦТ/ЦЭ) для поступления в вуз.</p>
                                    <p>На факультете не предусмотрено получение высшего образования по специальностям.</p>
                                  </div>
                                ) : (
                                  <>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                      Специальности:
                                    </h5>
                                    <ul className="space-y-2">
                                      {facultySpecialties.map(specialty => (
                                        <li 
                                          key={specialty.id}
                                          className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                          <div className="flex-1">
                                            <span className="text-foreground">{specialty.name}</span>
                                            {specialty.code && (
                                              <span className="text-xs text-muted-foreground ml-2">
                                                ({specialty.code})
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Institutes */}
            {institutes.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Институты ({institutes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {institutes.map(institute => {
                      const instituteSpecialties = specialties.filter(s => s.institute_id === institute.id);
                      const isExpanded = expandedFaculty === institute.id;
                      
                      return (
                        <div 
                          key={institute.id} 
                          className="border rounded-lg overflow-hidden border-primary/30"
                        >
                          <button
                            onClick={() => setExpandedFaculty(isExpanded ? null : institute.id)}
                            className="w-full p-4 flex items-center justify-between bg-primary/10 hover:bg-primary/15 transition-colors text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-primary" />
                                <h4 className="font-medium text-foreground">{institute.name}</h4>
                                {institute.code && (
                                  <span className="text-xs text-muted-foreground">({institute.code})</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {institute.id === 'bspu-i3' ? 'Повышение квалификации' : `${instituteSpecialties.length} специальностей`}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t bg-background"
                            >
                              <div className="p-4">
                                {institute.id === 'bspu-i3' ? (
                                  <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                      Институт повышения квалификации и переподготовки кадров БГПУ создан для{' '}
                                      <strong>руководителей и специалистов учреждений образования</strong>, желающих повысить свою квалификацию или получить новую специальность в области педагогики и образования.
                                    </p>
                                    <a 
                                      href="https://ipkip.bspu.by/" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                      <Globe className="w-4 h-4" />
                                      Перейти на сайт института →
                                    </a>
                                  </div>
                                ) : (
                                  <>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                      Специальности:
                                    </h5>
                                    <ul className="space-y-2">
                                      {instituteSpecialties.map(specialty => (
                                        <li 
                                          key={specialty.id}
                                          className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                          <div className="flex-1">
                                            <span className="text-foreground">{specialty.name}</span>
                                            {specialty.code && (
                                              <span className="text-xs text-muted-foreground ml-2">
                                                ({specialty.code})
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specialties without faculties */}
            {faculties.length === 0 && specialties.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Специальности ({specialties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {specialties.map(specialty => (
                      <li 
                        key={specialty.id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-foreground">{specialty.name}</span>
                          {specialty.code && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({specialty.code})
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Admission Stats */}
            {admissionStats.length > 0 && (faculties.length > 0 || institutes.length > 0) && (
              <Card className="mb-8" id="admission-stats">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Проходные баллы (2022-2025)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Мин. балл</span> — минимальный балл для поступления; 
                    <span className="font-medium ml-3">Ср. балл</span> — средний балл зачисленных студентов.
                    Данные только для бюджетных мест.
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Filters as Select */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="w-[180px]">
                      <Select value={selectedYear?.toString() || "all"} onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Год" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все годы</SelectItem>
                          {[2025, 2024, 2023, 2022].map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-[280px]">
                      <Select value={selectedFaculty || "all"} onValueChange={(v) => { setSelectedFaculty(v === "all" ? null : v); setSelectedSpecialty(null); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Факультет / Институт" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все факультеты и институты</SelectItem>
                          {faculties.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Факультеты</div>
                              {faculties.map(faculty => (
                                <SelectItem key={faculty.id} value={faculty.id}>{faculty.code || faculty.name}</SelectItem>
                              ))}
                            </>
                          )}
                          {institutes.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-1">Институты</div>
                              {institutes.map(institute => (
                                <SelectItem key={institute.id} value={institute.id}>{institute.code || institute.name}</SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedFaculty && (
                      <div className="w-[320px]">
                        <Select value={selectedSpecialty || "all"} onValueChange={(v) => setSelectedSpecialty(v === "all" ? null : v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Специальность" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все специальности</SelectItem>
                            {specialties
                              .filter(s => s.faculty_id === selectedFaculty || s.institute_id === selectedFaculty)
                              .map(specialty => (
                                <SelectItem key={specialty.id} value={specialty.id}>{specialty.name}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Selected faculty/specialty info */}
                  {(selectedFaculty || selectedSpecialty) && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      {selectedFaculty && !selectedSpecialty && (
                        <div>
                          <span className="text-xs text-muted-foreground">Выбран: </span>
                          <span className="font-medium text-foreground">
                            {faculties.find(f => f.id === selectedFaculty)?.name || institutes.find(i => i.id === selectedFaculty)?.name}
                          </span>
                        </div>
                      )}
                      {selectedSpecialty && (
                        <div>
                          <span className="text-xs text-muted-foreground">Выбрана специальность: </span>
                          <span className="font-medium text-foreground">
                            {specialties.find(s => s.id === selectedSpecialty)?.name}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {specialties.find(s => s.id === selectedSpecialty)?.faculty_id && 
                              `Факультет: ${faculties.find(f => f.id === specialties.find(s => s.id === selectedSpecialty)?.faculty_id)?.name}`
                            }
                            {specialties.find(s => s.id === selectedSpecialty)?.institute_id && 
                              `Институт: ${institutes.find(i => i.id === specialties.find(s => s.id === selectedSpecialty)?.institute_id)?.name}`
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chart */}
                  {(() => {
                    const filteredStats = admissionStats.filter(stat => {
                      if (selectedYear && stat.year !== selectedYear) return false;
                      if (selectedSpecialty && stat.specialty_id !== selectedSpecialty) return false;
                      if (selectedFaculty) {
                        const specialty = specialties.find(s => s.id === stat.specialty_id);
                        if (specialty?.faculty_id !== selectedFaculty && specialty?.institute_id !== selectedFaculty) return false;
                      }
                      return true;
                    });

                    let chartData: { year: number; min: number | null; avg: number | null; paid: number | null }[] = [];
                    
                    if (selectedSpecialty) {
                      chartData = filteredStats
                        .sort((a, b) => a.year - b.year)
                        .map(s => ({ 
                          year: s.year, 
                          min: s.min_score ? Number(s.min_score) : null, 
                          avg: s.avg_score ? Number(s.avg_score) : null,
                          paid: s.paid_min_score ? Number(s.paid_min_score) : null
                        }));
                    } else if (filteredStats.length > 0) {
                      const grouped = filteredStats.reduce((acc, stat) => {
                        const key = stat.year;
                        if (!acc[key]) acc[key] = { year: stat.year, minSum: 0, avgSum: 0, paidSum: 0, minCount: 0, avgCount: 0, paidCount: 0 };
                        if (stat.min_score) { acc[key].minSum += Number(stat.min_score); acc[key].minCount += 1; }
                        if (stat.avg_score) { acc[key].avgSum += Number(stat.avg_score); acc[key].avgCount += 1; }
                        if (stat.paid_min_score) { acc[key].paidSum += Number(stat.paid_min_score); acc[key].paidCount += 1; }
                        return acc;
                      }, {} as Record<number, { year: number; minSum: number; avgSum: number; paidSum: number; minCount: number; avgCount: number; paidCount: number }>);
                      
                      chartData = Object.values(grouped)
                        .map(v => ({ 
                          year: v.year, 
                          min: v.minCount > 0 ? Math.round(v.minSum / v.minCount) : null, 
                          avg: v.avgCount > 0 ? Math.round(v.avgSum / v.avgCount) : null,
                          paid: v.paidCount > 0 ? Math.round(v.paidSum / v.paidCount) : null
                        }))
                        .sort((a, b) => a.year - b.year);
                    }

                    const getSelectionTitle = () => {
                      if (selectedSpecialty) {
                        const spec = specialties.find(s => s.id === selectedSpecialty);
                        return spec?.name || '';
                      }
                      if (selectedFaculty) {
                        const fac = faculties.find(f => f.id === selectedFaculty);
                        const inst = institutes.find(i => i.id === selectedFaculty);
                        return fac?.name || inst?.name || '';
                      }
                      return '';
                    };

                    const hasAnyData = chartData.some(d => d.min || d.avg || d.paid);
                    
                    if (chartData.length > 1 && hasAnyData) {
                      const selectionTitle = getSelectionTitle();
                      return (
                        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                          <h4 className="text-sm font-medium mb-4">
                            Динамика проходных баллов{selectionTitle ? ` (${selectionTitle})` : ''}
                          </h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                              <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 12 }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                formatter={(value: number) => value ? [value, ''] : ['—', '']}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="min" name="Мин. (бюджет)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                              <Line type="monotone" dataKey="avg" name="Ср. (бюджет)" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                              <Line type="monotone" dataKey="paid" name="Платное" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <div className="max-h-[500px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                        <TableRow>
                          <TableHead>Специальность</TableHead>
                          <TableHead className="text-center">Год</TableHead>
                          <TableHead className="text-right">Бюджет</TableHead>
                          <TableHead className="text-right">Платное</TableHead>
                          <TableHead className="text-right">Ср. балл</TableHead>
                          <TableHead className="text-right">Мест</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admissionStats
                          .filter(stat => {
                            if (selectedYear && stat.year !== selectedYear) return false;
                            if (selectedSpecialty && stat.specialty_id !== selectedSpecialty) return false;
                            if (selectedFaculty) {
                              const specialty = specialties.find(s => s.id === stat.specialty_id);
                              if (specialty?.faculty_id !== selectedFaculty && specialty?.institute_id !== selectedFaculty) return false;
                            }
                            return true;
                          })
                          .map(stat => (
                          <TableRow key={stat.id}>
                            <TableCell className="font-medium">
                              {stat.specialty?.name || 'Н/Д'}
                              {stat.specialty?.code && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({stat.specialty.code})
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{stat.year}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-700">
                              {stat.min_score ? Number(stat.min_score).toFixed(0) : '—'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-700">
                              {stat.paid_min_score ? Number(stat.paid_min_score).toFixed(0) : '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {stat.avg_score ? Number(stat.avg_score).toFixed(0) : '—'}
                            </TableCell>
                            <TableCell className="text-right">{stat.budget_places || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No data notice */}
            {faculties.length === 0 && (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Данные загружаются</h3>
                  <p className="text-muted-foreground">
                    Детальная информация о факультетах и специальностях будет добавлена после парсинга данных.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default UniversityDetail;
