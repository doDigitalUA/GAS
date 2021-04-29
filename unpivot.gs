/**
 * Разверните сводную таблицу любого размера.
 *
 * @param {A1:D30} Диапазон Своднойтаблицы.
 * @param {1} fixColumns Количество столбцов, после которых начинаются сводные значения. По умолчанию 1.
 * @param {1} fixRows Количество строк (1 или 2), после которых начинаются сводные значения. По умолчанию 1.
 * @param {"city"} titlePivot Заголовок значений горизонтальной оси. Default "column".
 * @param {"distance"[,...]} titleValue Заголовок значений сводной таблицы. Default "value".
 * @return The unpivoted table
 * @customfunction
 */
function unpivot(data,fixColumns,fixRows,titlePivot,titleValue) {  
  var fixColumns = fixColumns || 1; // сколько столбцов закреплено
  var fixRows = fixRows || 1; // сколько строк зафиксировано
  var titlePivot = titlePivot || 'column';
  var titleValue = titleValue || 'value';
  var ret=[],i,j,row,uniqueCols=1;
  
  // мы обрабатываем только двухмерные массивы
  if (!Array.isArray(data) || data.length < fixRows || !Array.isArray(data[0]) || data[0].length < fixColumns)
    throw new Error('НЕТ ДАННЫХ');
  // we handle max 2 fixed rows
  if (fixRows > 2)
    throw new Error('допускается не более 2 фиксированных строк');
  
  // заполнить пустые ячейки в первой строке значением, установленным последним в предыдущих столбцах (для 2 фиксированных строк)
  var tmp = '';
  for (j=0;j<data[0].length;j++)
    if (data[0][j] != '') 
      tmp = data[0][j];
    else
      data[0][j] = tmp;
  // для 2 фиксированных строк вычислить уникальный номер столбца
  if (fixRows == 2)
  {
    uniqueCols = 0;
    tmp = {};
    for (j=fixColumns;j<data[1].length;j++)
      if (typeof tmp[ data[1][j] ] == 'undefined')
      {
        tmp[ data[1][j] ] = 1;
        uniqueCols++;
      }
  }
  // вернуть первую строку: исправить заголовки столбцов + заголовок столбца сводных значений + заголовок столбца значений
  row = [];
    for (j=0;j<fixColumns;j++) row.push(fixRows == 2 ? data[0][j]||data[1][j] : data[0][j]); // для 2 фиксированных строк мы пытаемся найти заголовок в строке 1 и строке 2
    for (j=3;j<arguments.length;j++) row.push(arguments[j]);
  ret.push(row);
    
  // обработка строк (пропуск фиксированных столбцов, затем выделение новой строки для каждого значения поворота)
  for (i=fixRows;i<data.length && data[i].length > 0 && data[i][0];i++)
  {
    row = [];
    for (j=0;j<fixColumns && j<data[i].length;j++)
      row.push(data[i][j]);
    for (j=fixColumns;j<data[i].length;j+=uniqueCols)
      ret.push( 
        row.concat([data[0][j]]) // the first row title value
        .concat(data[i].slice(j,j+uniqueCols)) // pivoted values
      );
  }
  return ret;
}
