import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
  data?: any;
}

export const DatabaseTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testResults: TestResult[] = [];

    try {
      // Test 1: Vérifier la connexion
      testResults.push({
        name: 'Connexion base de données',
        status: 'pending'
      });

      const students = await dataService.getAllStudents();
      testResults[0] = {
        name: 'Connexion base de données',
        status: 'success',
        message: `Connecté - ${students.length} étudiants trouvés`
      };

      // Test 2: Créer un étudiant
      testResults.push({
        name: 'Création étudiant',
        status: 'pending'
      });

      const newStudent = await dataService.createStudent({
        firstName: 'Test',
        lastName: 'Étudiant',
        email: 'test@example.com',
        dateOfBirth: '2000-01-01',
        classId: null,
        academicYearId: null,
        enrollmentDate: new Date().toISOString().split('T')[0]
      });
      testResults[1] = {
        name: 'Création étudiant',
        status: 'success',
        message: `Étudiant créé avec ID: ${newStudent.id}`
      };

      // Test 3: Lire l'étudiant
      testResults.push({
        name: 'Lecture étudiant',
        status: 'pending'
      });

      const readStudent = await dataService.getStudentById(newStudent.id);
      testResults[2] = {
        name: 'Lecture étudiant',
        status: 'success',
        message: `Étudiant trouvé: ${readStudent.firstName} ${readStudent.lastName}`
      };

      // Test 4: Mettre à jour l'étudiant
      testResults.push({
        name: 'Mise à jour étudiant',
        status: 'pending'
      });

      await dataService.updateStudent(newStudent.id, {
        firstName: 'Test Updated'
      });
      testResults[3] = {
        name: 'Mise à jour étudiant',
        status: 'success',
        message: 'Étudiant mis à jour avec succès'
      };

      // Test 5: Supprimer l'étudiant
      testResults.push({
        name: 'Suppression étudiant',
        status: 'pending'
      });

      await dataService.deleteStudent(newStudent.id);
      testResults[4] = {
        name: 'Suppression étudiant',
        status: 'success',
        message: 'Étudiant supprimé avec succès'
      };

      // Test 6: Statistiques
      testResults.push({
        name: 'Statistiques dashboard',
        status: 'pending'
      });

      const stats = await dataService.getDashboardStats();
      testResults[5] = {
        name: 'Statistiques dashboard',
        status: 'success',
        message: `Stats récupérées - ${stats.totalStudents} étudiants, ${stats.totalTeachers} enseignants`
      };

    } catch (error) {
      testResults.push({
        name: 'Erreur générale',
        status: 'error',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    setTests(testResults);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Test d'Intégration Base de Données
        </h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Tests en cours...' : 'Relancer les tests'}
        </button>
      </div>

      <div className="space-y-3">
        {tests.map((test, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <span className="text-lg">{getStatusIcon(test.status)}</span>
            <div className="flex-1">
              <div className={`font-medium ${getStatusColor(test.status)}`}>
                {test.name}
              </div>
              {test.message && (
                <div className="text-sm text-gray-600 mt-1">
                  {test.message}
                </div>
              )}
              {test.data && (
                <div className="text-xs text-gray-500 mt-1">
                  <pre className="overflow-auto max-h-20">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tests.length > 0 && !isRunning && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">
            Résumé des tests
          </h3>
          <div className="text-sm text-blue-700">
            <p>Tests passés: {tests.filter(t => t.status === 'success').length}</p>
            <p>Tests échoués: {tests.filter(t => t.status === 'error').length}</p>
            <p>Tests en attente: {tests.filter(t => t.status === 'pending').length}</p>
          </div>
        </div>
      )}
    </div>
  );
};
