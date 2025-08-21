import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  BookOpen,
  Settings,
  Eye,
  Edit,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  MapPin,
  User,
  Building,
  FileText
} from 'lucide-react';
import { 
  ClassModal, 
  RoomModal, 
  SubjectModal, 
  BreakModal, 
  RoomReservationModal, 
  TeacherAssignmentModal, 
  ScheduleEntryModal, 
  TeacherAvailabilityModal, 
  WorkHoursModal
} from '../modals';
import CahierJournalDashboard from '../../modules/planning/components/CahierJournal/CahierJournalDashboard';
import FichesPedagogiquesDashboard from '../../modules/planning/components/FichesPedagogiques/FichesPedagogiquesDashboard';
import CahierTexteApp from '../../modules/planning/components/CahierTextes/CahierTexteApp';
import EmploiDuTempsModern from './EmploiDuTempsModern';
import { usePlanningData } from '../../hooks/usePlanningData';

const Planning: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isRoomReservationModalOpen, setIsRoomReservationModalOpen] = useState(false);
  const [isTeacherAssignmentModalOpen, setIsTeacherAssignmentModalOpen] = useState(false);
  const [isScheduleEntryModalOpen, setIsScheduleEntryModalOpen] = useState(false);
  const [isTeacherAvailabilityModalOpen, setIsTeacherAvailabilityModalOpen] = useState(false);
  const [isWorkHoursModalOpen, setIsWorkHoursModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    classes,
    rooms,
    subjects,
    teachers,
    schedule,
    breaks,
    workHours,
    stats,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    createRoom,
    updateRoom,
    createSubject,
    createScheduleEntry,
    saveBreaks,
    saveWorkHours
  } = usePlanningData();

  const planningStats = stats;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'occupied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reserved': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Modal handlers
  const handleNewClass = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsClassModalOpen(true);
  };

  const handleNewRoom = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsRoomModalOpen(true);
  };

  const handleNewSubject = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsSubjectModalOpen(true);
  };

  const handleConfigureBreaks = () => {
    setIsBreakModalOpen(true);
  };

  const handleConfigureWorkHours = () => {
    setIsWorkHoursModalOpen(true);
  };

  const handleNewScheduleEntry = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsScheduleEntryModalOpen(true);
  };

  const handleNewReservation = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsRoomReservationModalOpen(true);
  };

  const handleNewAssignment = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTeacherAssignmentModalOpen(true);
  };

  const handleTeacherAvailability = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTeacherAvailabilityModalOpen(true);
  };

  const handleSaveClass = (classData: any) => {
    console.log('Saving class:', classData);
  };

  const handleSaveRoom = (roomData: any) => {
    console.log('Saving room:', roomData);
  };

  const handleSaveSubject = (subjectData: any) => {
    console.log('Saving subject:', subjectData);
  };

  const handleSaveBreaks = (breaksData: any) => {
    saveBreaks(breaksData);
    console.log('Saving breaks:', breaksData);
  };

  const handleSaveWorkHours = (workHoursData: any) => {
    saveWorkHours(workHoursData);
    console.log('Saving work hours:', workHoursData);
  };

  const handleSaveReservation = (reservationData: any) => {
    console.log('Saving reservation:', reservationData);
  };

  const handleSaveAssignment = (assignmentData: any) => {
    console.log('Saving assignment:', assignmentData);
  };

  const handleSaveScheduleEntry = (scheduleData: any) => {
    console.log('Saving schedule entry:', scheduleData);
  };

  const handleSaveAvailability = (availabilityData: any) => {
    console.log('Saving availability:', availabilityData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Études & Planification</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion intelligente des emplois du temps et ressources</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={handleConfigureWorkHours}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </button>
          <button 
            onClick={handleNewScheduleEntry}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau cours
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planningStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'rooms', label: 'Salles', icon: Building },
              { id: 'classes', label: 'Classes', icon: Users },
              { id: 'reservations', label: 'Réservations', icon: MapPin },
              { id: 'subjects', label: 'Matières', icon: BookOpen },
              { id: 'teachers', label: 'Enseignants', icon: User },
              { id: 'availability', label: 'Disponibilités', icon: Clock },
              { id: 'work-hours', label: 'Heures de cours', icon: BarChart3 },
              { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
              { id: 'journal', label: 'Cahier Journal', icon: BookOpen },
              { id: 'fiches-pedagogiques', label: 'Fiches Pédagogiques', icon: FileText },
              { id: 'cahier-textes', label: 'Cahier de Textes', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'schedule' && (
            <EmploiDuTempsModern
              schedules={schedule}
              classes={classes}
              teachers={teachers}
              subjects={subjects}
              rooms={rooms}
            />
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des classes</h3>
                <button 
                  onClick={handleNewClass}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle classe
                </button>
              </div>

              <div className="grid gap-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{cls.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cls.level} • {cls.students} élèves</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Prof principal: {cls.mainTeacher}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Salle: {cls.room}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            Emploi du temps
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des salles</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleNewReservation}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver
                  </button>
                  <button 
                    onClick={handleNewRoom}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle salle
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{room.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{room.type} • {room.capacity} places</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Équipements: {room.equipment.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {room.status === 'available' ? 'Disponible' : 
                           room.status === 'occupied' ? 'Occupée' : 
                           room.status === 'maintenance' ? 'Maintenance' : 'Réservée'}
                        </span>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50">
                            Planning
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des matières</h3>
                <button 
                  onClick={handleNewSubject}
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle matière
                </button>
              </div>

              <div className="grid gap-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{subject.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Code: {subject.code} • Niveau: {subject.level}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Coefficient: {subject.coefficient}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50">
                          Enseignants
                        </button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Affectations des enseignants</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleTeacherAvailability}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Disponibilités
                  </button>
                  <button 
                    onClick={handleNewAssignment}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle affectation
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{teacher.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.subject}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Classes: {teacher.classes.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Charge: {teacher.hoursPerWeek}h/semaine</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50">
                            Planning
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Réservations de salles</h3>
                <button 
                  onClick={handleNewReservation}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle réservation
                </button>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/30">
                <h4 className="text-lg font-medium text-indigo-900 dark:text-indigo-300 mb-4">Réservations du jour</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Salle informatique</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">14:00 - 16:00 • M. Dubois • 1ère S</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                      Confirmée
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Laboratoire SVT</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">10:00 - 12:00 • Mme Martin • 2nde A</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                      En attente
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Disponibilités des enseignants</h3>
                <button 
                  onClick={handleTeacherAvailability}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle disponibilité
                </button>
              </div>

              <div className="grid gap-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{teacher.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {teacher.subjects?.join(', ') || 'Aucune matière assignée'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(teacher);
                            setIsEditMode(true);
                            setIsTeacherAvailabilityModalOpen(true);
                          }}
                          className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir disponibilité
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {teachers.length === 0 && (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun enseignant trouvé</h3>
                    <p className="text-gray-600 dark:text-gray-400">Commencez par ajouter des enseignants pour gérer leurs disponibilités.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'work-hours' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configuration des Heures de Cours
                </h2>
                <button
                  onClick={handleConfigureWorkHours}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier les horaires
                </button>
              </div>

              {workHours && workHours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workHours.map((day: any) => (
                    <div key={day.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {day.day}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          day.is_work_day 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {day.is_work_day ? 'Jour travaillé' : 'Jour non travaillé'}
                        </span>
                      </div>

                      {day.is_work_day && (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Début:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {day.start_time || 'Non défini'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Fin:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {day.end_time || 'Non défini'}
                            </span>
                          </div>
                          {day.breaks && day.breaks.length > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Pauses:</span>
                              <div className="mt-1 space-y-1">
                                {day.breaks.map((breakItem: any, index: number) => (
                                  <div key={index} className="text-xs bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                                    {breakItem.name}: {breakItem.start_time} - {breakItem.end_time}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucune configuration d'horaires
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Configurez les horaires de cours pour votre établissement
                  </p>
                  <button
                    onClick={handleConfigureWorkHours}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer les horaires
                  </button>
                </div>
              )}
            </div>
          )}


          {activeTab === 'journal' && (
            <CahierJournalDashboard />
          )}

          {activeTab === 'fiches-pedagogiques' && (
            <FichesPedagogiquesDashboard />
          )}
          {activeTab === 'cahier-textes' && (
            <CahierTexteApp />
          )}
        </div>
      </div>

      {/* Modals */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        classData={selectedItem}
        isEdit={isEditMode}
      />

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
        roomData={selectedItem}
        isEdit={isEditMode}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
        subjectData={selectedItem}
        isEdit={isEditMode}
      />

      <BreakModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
        onSave={handleSaveBreaks}
        currentBreaks={breaks}
      />

      <WorkHoursModal
        isOpen={isWorkHoursModalOpen}
        onClose={() => setIsWorkHoursModalOpen(false)}
        onSave={handleSaveWorkHours}
        currentWorkHours={workHours}
      />

      <RoomReservationModal
        isOpen={isRoomReservationModalOpen}
        onClose={() => setIsRoomReservationModalOpen(false)}
        onSave={handleSaveReservation}
        reservationData={selectedItem}
        isEdit={isEditMode}
        rooms={rooms}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
      />

      <TeacherAssignmentModal
        isOpen={isTeacherAssignmentModalOpen}
        onClose={() => setIsTeacherAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        assignmentData={selectedItem}
        isEdit={isEditMode}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
      />

      <ScheduleEntryModal
        isOpen={isScheduleEntryModalOpen}
        onClose={() => setIsScheduleEntryModalOpen(false)}
        onSave={handleSaveScheduleEntry}
        scheduleData={selectedItem}
        isEdit={isEditMode}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
        rooms={rooms}
      />

      <TeacherAvailabilityModal
        isOpen={isTeacherAvailabilityModalOpen}
        onClose={() => setIsTeacherAvailabilityModalOpen(false)}
        onSave={handleSaveAvailability}
        teacherId={selectedItem?.id}
        teacherName={selectedItem?.name}
      />


    </div>
  );
};

export default Planning;