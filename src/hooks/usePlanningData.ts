import { useState, useEffect, useCallback } from 'react';
import {
  PlanningClass,
  PlanningRoom,
  PlanningSubject,
  PlanningTeacher,
  PlanningSchedule,
  PlanningBreak,
  WorkHoursConfig,
  PlanningStats
} from '../types/planning';
import { planningService } from '../services/planningService';

interface UsePlanningDataReturn {
  // Data states
  classes: PlanningClass[];
  rooms: PlanningRoom[];
  subjects: PlanningSubject[];
  teachers: PlanningTeacher[];
  schedule: PlanningSchedule[];
  breaks: PlanningBreak[];
  workHours: WorkHoursConfig | null;
  stats: PlanningStats[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  refreshData: () => Promise<void>;
  createClass: (classData: Partial<PlanningClass>) => Promise<void>;
  updateClass: (id: string, classData: Partial<PlanningClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  createRoom: (roomData: Partial<PlanningRoom>) => Promise<void>;
  updateRoom: (id: string, roomData: Partial<PlanningRoom>) => Promise<void>;
  createSubject: (subjectData: Partial<PlanningSubject>) => Promise<void>;
  createScheduleEntry: (scheduleData: Partial<PlanningSchedule>) => Promise<void>;
  saveBreaks: (breaks: PlanningBreak[]) => Promise<void>;
  saveWorkHours: (config: WorkHoursConfig) => Promise<void>;
}

export function usePlanningData(): UsePlanningDataReturn {
  const [classes, setClasses] = useState<PlanningClass[]>([]);
  const [rooms, setRooms] = useState<PlanningRoom[]>([]);
  const [subjects, setSubjects] = useState<PlanningSubject[]>([]);
  const [teachers, setTeachers] = useState<PlanningTeacher[]>([]);
  const [schedule, setSchedule] = useState<PlanningSchedule[]>([]);
  const [breaks, setBreaks] = useState<PlanningBreak[]>([]);
  const [workHours, setWorkHours] = useState<WorkHoursConfig | null>(null);
  const [stats, setStats] = useState<PlanningStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        classesData,
        roomsData,
        subjectsData,
        teachersData,
        scheduleData,
        breaksData,
        workHoursData,
        statsData
      ] = await Promise.all([
        planningService.getClasses(),
        planningService.getRooms(),
        planningService.getSubjects(),
        planningService.getTeachers(),
        planningService.getSchedule(),
        planningService.getBreaks(),
        planningService.getWorkHoursConfig(),
        planningService.getPlanningStats()
      ]);

      setClasses(classesData);
      setRooms(roomsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setSchedule(scheduleData);
      setBreaks(breaksData);
      setWorkHours(workHoursData);
      
      // Transform stats data
      const transformedStats: PlanningStats[] = [
        {
          title: 'Classes actives',
          value: statsData.activeClasses?.toString() || '0',
          change: '+2',
          icon: 'Users',
          color: 'from-blue-600 to-blue-700'
        },
        {
          title: 'Enseignants',
          value: statsData.activeTeachers?.toString() || '0',
          change: '+3',
          icon: 'User',
          color: 'from-green-600 to-green-700'
        },
        {
          title: 'Salles disponibles',
          value: statsData.availableRooms?.toString() || '0',
          change: '+1',
          icon: 'Building',
          color: 'from-purple-600 to-purple-700'
        },
        {
          title: 'Cours programmés',
          value: statsData.totalScheduleEntries?.toString() || '0',
          change: '+5',
          icon: 'Calendar',
          color: 'from-orange-600 to-orange-700'
        }
      ];
      setStats(transformedStats);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error fetching planning data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CRUD operations
  const createClass = async (classData: Partial<PlanningClass>) => {
    try {
      await planningService.createClass(classData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la classe');
      throw err;
    }
  };

  const updateClass = async (id: string, classData: Partial<PlanningClass>) => {
    try {
      await planningService.updateClass(id, classData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la classe');
      throw err;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await planningService.deleteClass(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la classe');
      throw err;
    }
  };

  const createRoom = async (roomData: Partial<PlanningRoom>) => {
    try {
      await planningService.createRoom(roomData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la salle');
      throw err;
    }
  };

  const updateRoom = async (id: string, roomData: Partial<PlanningRoom>) => {
    try {
      await planningService.updateRoom(id, roomData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la salle');
      throw err;
    }
  };

  const createSubject = async (subjectData: Partial<PlanningSubject>) => {
    try {
      await planningService.createSubject(subjectData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la matière');
      throw err;
    }
  };

  const createScheduleEntry = async (scheduleData: Partial<PlanningSchedule>) => {
    try {
      await planningService.createScheduleEntry(scheduleData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du cours');
      throw err;
    }
  };

  const saveBreaks = async (breaksData: PlanningBreak[]) => {
    try {
      await planningService.saveBreaks(breaksData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde des pauses');
      throw err;
    }
  };

  const saveWorkHours = async (config: WorkHoursConfig) => {
    try {
      await planningService.saveWorkHoursConfig(config);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde des heures de travail');
      throw err;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // Data states
    classes,
    rooms,
    subjects,
    teachers,
    schedule,
    breaks,
    workHours,
    stats,
    
    // Loading states
    loading,
    error,
    
    // CRUD operations
    refreshData: fetchData,
    createClass,
    updateClass,
    deleteClass,
    createRoom,
    updateRoom,
    createSubject,
    createScheduleEntry,
    saveBreaks,
    saveWorkHours
  };
}
