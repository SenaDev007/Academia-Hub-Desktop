import React, { useState, useMemo } from 'react';
import { Filter, Download, Printer, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleEntry {
  id: string | number;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
  duration?: string;
}

interface Break {
  name: string;
  startTime: string;
  endTime: string;
}

interface Class {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
}

interface EmploiDuTempsProps {
  schedules: ScheduleEntry[];
  classes: Class[];
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
}

const EmploiDuTempsModern: React.FC<EmploiDuTempsProps> = ({
  schedules,
  classes,
  teachers,
  subjects,
  rooms
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  const breaks: Break[] = [
    { name: 'Récréation', startTime: '10:00', endTime: '10:15' },
    { name: 'Déjeuner', startTime: '12:00', endTime: '13:00' },
    { name: 'Récréation', startTime: '15:00', endTime: '15:15' }
  ];

  const subjectColors: { [key: string]: string } = {
    'Mathématiques': 'bg-blue-500',
    'Français': 'bg-red-500',
    'Anglais': 'bg-green-500',
    'Physique': 'bg-purple-500',
    'Chimie': 'bg-orange-500',
    'SVT': 'bg-teal-500',
    'Histoire': 'bg-yellow-500',
    'Géographie': 'bg-indigo-500',
    'EPS': 'bg-pink-500',
    'Art': 'bg-rose-500',
    'Musique': 'bg-cyan-500'
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      return (
        (selectedClass === 'all' || schedule.class === selectedClass) &&
        (selectedSubject === 'all' || schedule.subject === selectedSubject) &&
        (selectedTeacher === 'all' || schedule.teacher === selectedTeacher)
      );
    });
  }, [schedules, selectedClass, selectedSubject, selectedTeacher]);

  const getScheduleForSlot = (day: string, time: string) => {
    return filteredSchedules.find(schedule => schedule.day === day && schedule.time === time);
  };

  const isBreakTime = (time: string) => {
    return breaks.some(breakItem => {
      const [startHour] = breakItem.startTime.split(':');
      const [slotHour] = time.split('-')[0].split(':');
      return startHour === slotHour;
    });
  };

  const getBreakForTime = (time: string) => {
    return breaks.find(breakItem => {
      const [startHour] = breakItem.startTime.split(':');
      const [slotHour] = time.split('-')[0].split(':');
      return startHour === slotHour;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = (schedule: ScheduleEntry) => {
    setEditingSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedSchedule: ScheduleEntry) => {
    // In a real app, this would update the backend
    console.log('Updated schedule:', updatedSchedule);
    setIsEditModalOpen(false);
    setEditingSchedule(null);
  };

  const handleAddNew = () => {
    setEditingSchedule(null);
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (newSchedule: ScheduleEntry) => {
    // In a real app, this would add to the backend
    console.log('New schedule:', newSchedule);
    setIsAddModalOpen(false);
  };

  const handleExport = () => {
    const csvContent = [
      ['Jour', 'Horaire', 'Matière', 'Enseignant', 'Classe', 'Salle'],
      ...filteredSchedules.map(s => [s.day, s.time, s.subject, s.teacher, s.class, s.room])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emploi-du-temps-${selectedClass}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {isEditModalOpen && editingSchedule && (
        <EditModal
          schedule={editingSchedule}
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
          subjects={subjects}
          teachers={teachers}
          rooms={rooms}
          mode="edit"
        />
      )}
      {isAddModalOpen && (
        <EditModal
          schedule={{
            id: Date.now(),
            day: 'Lundi',
            time: '08:00 - 09:00',
            subject: subjects[0]?.name || '',
            teacher: teachers[0]?.name || '',
            class: classes[0]?.name || '',
            room: rooms[0]?.name || '',
            duration: '45min'
          }}
          onSave={handleSaveNew}
          onClose={() => setIsAddModalOpen(false)}
          subjects={subjects}
          teachers={teachers}
          rooms={rooms}
          mode="add"
        />
      )}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Emploi du temps</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez et visualisez l'emploi du temps des classes
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {viewMode === 'table' ? 'Vue Grille' : 'Vue Tableau'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Filtres</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sélectionner une classe"
            >
              <option value="all">Toutes les classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Matière
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sélectionner une matière"
            >
              <option value="all">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enseignant
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sélectionner un enseignant"
            >
              <option value="all">Tous les enseignants</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Semaine
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Semaine précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-center min-w-[80px] text-gray-900 dark:text-gray-100">
                S{currentWeek + 1}
              </span>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Semaine suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Display */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Horaire
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {timeSlots.map(timeSlot => {
                  const breakInfo = isBreakTime(timeSlot) ? getBreakForTime(timeSlot) : null;
                  
                  return (
                    <tr key={timeSlot}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {timeSlot}
                        </div>
                      </td>
                      {days.map(day => {
                        const schedule = getScheduleForSlot(day, timeSlot);
                        
                        if (breakInfo) {
                          return (
                            <td key={day} className="px-6 py-4 bg-amber-50 dark:bg-amber-900/20">
                              <div className="text-center">
                                <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                  {breakInfo.name}
                                </div>
                                <div className="text-xs text-amber-600 dark:text-amber-400">
                                  {breakInfo.startTime} - {breakInfo.endTime}
                                </div>
                              </div>
                            </td>
                          );
                        }
                        
                        if (schedule) {
                          return (
                            <td key={day} className="px-6 py-4">
                              <div className={`p-3 rounded-lg ${subjectColors[schedule.subject] || 'bg-gray-500'} text-white relative group`}>
                                <div className="font-medium text-sm">
                                  {schedule.subject}
                                  {schedule.duration && (
                                    <span className="font-bold ml-1">({schedule.duration})</span>
                                  )}
                                </div>
                                <div className="text-xs opacity-90">{schedule.teacher}</div>
                                <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {schedule.room}
                                </div>
                                <button
                                  onClick={() => handleEdit(schedule)}
                                  className="absolute top-1 right-1 p-1 bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Modifier"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={day} className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                            <div className="text-center text-sm text-gray-400 dark:text-gray-500">
                              Libre
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {days.map(day => (
            <div key={day} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">{day}</h4>
              <div className="space-y-3">
                {timeSlots.map(timeSlot => {
                  const schedule = getScheduleForSlot(day, timeSlot);
                  const breakInfo = isBreakTime(timeSlot) ? getBreakForTime(timeSlot) : null;
                  
                  if (breakInfo) {
                    return (
                      <div key={timeSlot} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          {breakInfo.name}
                        </div>
                        <div className="text-xs text-amber-600 dark:text-amber-400">
                          {breakInfo.startTime} - {breakInfo.endTime}
                        </div>
                      </div>
                    );
                  }
                  
                  if (schedule) {
                    return (
                      <div key={timeSlot} className={`p-3 rounded-lg ${subjectColors[schedule.subject] || 'bg-gray-500'} text-white relative group`}>
                        <div className="font-medium text-sm">
                          {schedule.subject}
                          {schedule.duration && (
                            <span className="font-bold ml-1">({schedule.duration})</span>
                          )}
                        </div>
                        <div className="text-xs opacity-90">{schedule.teacher}</div>
                        <div className="text-xs opacity-75">{timeSlot}</div>
                        <div className="text-xs opacity-75 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {schedule.room}
                        </div>
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="absolute top-1 right-1 p-1 bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Modifier"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={timeSlot} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-400 dark:text-gray-500">
                        {timeSlot} - Libre
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Légende des matières</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(subjectColors).map(([subject, color]) => (
            <div key={subject} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${color}`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface EditModalProps {
  schedule: ScheduleEntry;
  onSave: (schedule: ScheduleEntry) => void;
  onClose: () => void;
  subjects: { id: string; name: string }[];
  teachers: { id: string; name: string }[];
  rooms: { id: string; name: string }[];
  mode: 'edit' | 'add';
}

const EditModal: React.FC<EditModalProps> = ({ schedule, onSave, onClose, subjects, teachers, rooms, mode }) => {
  const [editedSchedule, setEditedSchedule] = useState(schedule);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedSchedule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {mode === 'edit' ? 'Modifier' : 'Ajouter'} l'emploi du temps
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matière
            </label>
            <select
              value={editedSchedule.subject}
              onChange={(e) => setEditedSchedule({ ...editedSchedule, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sélectionner la matière"
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enseignant
            </label>
            <select
              value={editedSchedule.teacher}
              onChange={(e) => setEditedSchedule({ ...editedSchedule, teacher: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sélectionner l'enseignant"
            >
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Salle
            </label>
            <select
              value={editedSchedule.room}
              onChange={(e) => setEditedSchedule({ ...editedSchedule, room: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sélectionner la salle"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.name}>{room.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jour
            </label>
            <select
              value={editedSchedule.day}
              onChange={(e) => setEditedSchedule({ ...editedSchedule, day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sélectionner le jour"
            >
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Horaire
            </label>
            <select
              value={editedSchedule.time}
              onChange={(e) => setEditedSchedule({ ...editedSchedule, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sélectionner l'horaire"
            >
              {[
                '08:00 - 09:00',
                '09:00 - 10:00',
                '10:00 - 11:00',
                '11:00 - 12:00',
                '12:00 - 13:00',
                '13:00 - 14:00',
                '14:00 - 15:00',
                '15:00 - 16:00',
                '16:00 - 17:00'
              ].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée
            </label>
            <input
              type="text"
              value={editedSchedule.duration || ''}
              onChange={(e) => setEditedSchedule({
                ...editedSchedule,
                duration: e.target.value || undefined
              })}
              placeholder="Ex: 45min, 1h, 1h30min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmploiDuTempsModern;
