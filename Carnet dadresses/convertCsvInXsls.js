import fs from "fs"
import { parse } from "csv-parse";
import XLSX from "xlsx";

// Fonction pour convertir CSV en Excel
function convertCsvToExcel(csvFilePath, excelFilePath) {
  // Créer un stream de lecture pour le fichier CSV
  const csvStream = fs.createReadStream(csvFilePath, { encoding: 'utf8' });

  // Tableau pour stocker les données CSV
  const records = [];

  // Parser le CSV avec les en-têtes
  const parser = parse({
    columns: true, // Utiliser la première ligne comme en-têtes
  });

  // Événement pour collecter chaque ligne du CSV
  parser.on('readable', function () {
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  // Gérer les erreurs
  parser.on('error', function (err) {
    console.error('Erreur lors du parsing CSV:', err.message);
  });

  // Lorsque le parsing est terminé, créer le fichier Excel
  parser.on('end', function () {
    // Créer un nouveau classeur Excel
    const workbook = XLSX.utils.book_new();
    
    // Convertir les données en feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(records, {
      header: ['id', 'name', 'tel', 'email'], // En-têtes spécifiques
      skipHeader: false
    });

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Écrire le fichier Excel
    XLSX.writeFile(workbook, excelFilePath);
    
  });

  // Lancer le stream
  csvStream.pipe(parser);
}

// Exemple d'utilisation
convertCsvToExcel("./Carnet dadresses/database.csv", './Carnet dadresses/database.xlsx');

export default convertCsvToExcel;