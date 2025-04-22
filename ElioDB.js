import mysql from "mysql2"
import { createAsciiTable } from "./utils/beautyConsole.js"



//-------------------- INSERT --------------------//
// const newUser = await db.insert('users', {
//   name: 'Jane Doe',
//   password: 'securepassword',
//   profileimg: 'jane.jpg',
//   email: 'jane.doe@example.com'
// })

//-------------------- UPDATE --------------------//
// const updatedUser = await db.update('users', { name: 'Jane Smith' }, { email: 'jane.doe@example.com' })
// console.log(updatedUser)

//-------------------- DELETE --------------------//
// const deletedUser = await db.delete('users', { email: 'jane.doe@example.com' })
// console.log(deletedUser)

//-------------------- FIND --------------------//
// const users = await db.find('users', { name: 'Jane Doe' })
// console.log(users)

//-------------------- FIND ONE --------------------//
// const user = await db.findOne('users', { email: 'jane.doe@example.com' })
// console.log(user)



export default class ElioDB {
  constructor({ host, user, password, database, port }) {
    // Creates a connection pool to the MySQL database with the provided configuration
    const db_pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port
    });

    // Initializes the db property with a promise-based connection pool
    this.db = db_pool.promise()
    this.ORDER_METHODS = ['ASC', 'DESC'] // Allowed order methods for sorting
  }


  /**
 * UNFILTERED SQL
 */
  async query(...params) {
    const [rows] = await this.db.query(...params)
    return rows
  }

    

  /**
   * Finds multiple rows from a table based on given conditions and a limit.
   * @param {string} table - The name of the table to query.
   * @param {Object} conditions - Conditions to filter the rows.
   * @param {Object} options - Query options: limit, orderBy, order, offset, random.
   * @returns {Array} - Array of rows that match the conditions.
   */
  async find(table, conditions = {}, options = {}) {

    const {
      limit, // = 50
      offset,
      orderBy,
      order = 'ASC',
      random = false
    } = options
    
    const upperOrder = order.toUpperCase()

    if (!this.ORDER_METHODS.includes(upperOrder)) {
      throw new Error(`Invalid order method: ${order}. Use one of: ${this.ORDER_METHODS.join(', ')}`)
    }

    let query = `SELECT * FROM ${table}`
    const queryParams = []
    const queryValues = []
    
    // WHERE clause
    for (const [key, value] of Object.entries(conditions)) {
      queryParams.push(`${key} = ?`)
      queryValues.push(value)
    }

    if (queryParams.length > 0) {
      query += ` WHERE ${queryParams.join(" AND ")}`
    }

    // ORDER BY clause
    if (random) {
      query += ` ORDER BY RAND()`
    } else if (orderBy) {
      query += ` ORDER BY ${orderBy} ${upperOrder}`
    }

    // LIMIT & OFFSET
    if (typeof limit === 'number') {
      query += ` LIMIT ?`
      queryValues.push(limit)
    }

    if (typeof offset === 'number') {
      query += ` OFFSET ?`
      queryValues.push(offset)
    }
    
    // Execute the query and return the result
    const [rows] = await this.db.query(query, [...queryValues, limit])
    return rows
  }





  /**
   * Finds a single row from a table based on given conditions.
   * @param {string} table - The name of the table to query.
   * @param {Object} conditions - Conditions to filter the row.
   * @param {Object} options - Optional query options (e.g. orderBy, order).
   * @returns {Object|null} - The first row that matches the conditions or null if not found.
   */
  async findOne(table, conditions = {}, options = {}) {
    const results = await this.find(table, conditions, { ...options, limit: 1 })
    return results[0] || null
  }






  /**
   * Inserts a new record into a table.
   * @param {string} table - The name of the table to insert into.
   * @param {Object} data - The data to insert, where keys are column names and values are the data to insert.
   * @returns {Object} - The result of the insert query.
   */
  async insert(table, data) {
    // Build the columns and placeholders for the insert query
    const columns = Object.keys(data).join(", ")
    const placeholders = Object.keys(data).map(() => "?").join(", ")
    const values = Object.values(data)

    // Construct the query string for inserting data into the table
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`

    // Execute the query and return the result
    const [result] = await this.db.query(query, values)
    return result
  }







  /**
   * Updates records in a table based on given conditions.
   * @param {string} table - The name of the table to update.
   * @param {Object} data - Data to update, where keys are column names and values are the new data.
   * @param {Object} conditions - Conditions to filter which rows to update.
   * @returns {Object} - The result of the update query.
   */
  async update(table, data, conditions, options = {}) {

    const { 
      allowUnsafe,
      ignore,
      replace,
      returning,
    } = options

    const setParams = [] // For holding the SET clause parts
    const setValues = [] // For holding the values to set
    const conditionParams = [] // For holding the WHERE clause parts
    const conditionValues = [] // For holding condition values

    // Build the SET clause of the query
    for (const [key, value] of Object.entries(data)) {
      setParams.push(`${key} = ?`)
      setValues.push(value)
    }

    // Build the WHERE clause of the query
    for (const [key, value] of Object.entries(conditions)) {
      if (Array.isArray(value)) {
        conditionParams.push(`${key} IN (?)`);
        conditionValues.push(value);
      } else if (value !== undefined && value !== null) { // ✅ Ensure valid values
        conditionParams.push(`${key} = ?`);
        conditionValues.push(value);
      }
    }
  
    // ✅ Prevent executing an UPDATE without WHERE conditions
    if (conditionParams.length === 0 && allowUnsafe !== "allowUnsafe") {
      throw new Error("UPDATE query rejected: No valid WHERE conditions provided. Use 'allowUnsafe' to bypass this check.");
    }
  
    // Construct the full UPDATE query
    let query = `UPDATE ${table} SET ${setParams.join(", ")}` + (conditionParams.length > 0 ? ` WHERE ${conditionParams.join(" AND ")}` : "");
    
    
    if (ignore) query = query.replace('UPDATE', 'UPDATE IGNORE')
    if (replace) query = query.replace('UPDATE', 'REPLACE INTO')
    if (returning) query += ` RETURNING *`
    
    // Execute the update query and return the result
    const [result] = await this.db.query(query, [...setValues, ...conditionValues]);
    return result;
  }
  






  /**
   * Deletes records from a table based on given conditions.
   * @param {string} table - The name of the table to delete from.
   * @param {Object} conditions - Conditions to filter which rows to delete.
   * @returns {Object} - The result of the delete query.
   */
  async delete(table, conditions) {    
    const conditionParams = [] // For holding the WHERE clause parts
    const conditionValues = [] // For holding condition values

    // Build the WHERE clause of the query
    for (const [key, value] of Object.entries(conditions)) {
      conditionParams.push(`${key} = ?`)
      conditionValues.push(value)
    }

    // ✅ Prevent executing an DELETE without WHERE conditions
    if (conditionParams.length === 0) {
      throw new Error("DELETE query rejected: No valid WHERE conditions provided. Use 'allowUnsafe' to bypass this check.");
    }

    // Construct the full DELETE query
    const query = `DELETE FROM ${table} WHERE ${conditionParams.join(" AND ")}`

    // Execute the delete query and return the result
    const [result] = await this.db.query(query, conditionValues)
    return result
  }





   /**
   * Fetches all rows from a table and prints them as an ASCII table.
   * @param {string} table - The name of the table to print.
   * @param {Object} [tableOptions] - Options to configure the table formatting.
   * @returns {void}
   */
   async printTable(table, tableOptions = {}) {
    // Fetch all rows from the given table
    const allRows = await this.find(table, {})

    // If no rows are found, log a message and return
    if (allRows.length === 0) {
      console.log(`No data found in the ${table} table.`)
      return
    }

    // Convert rows into a 2D array for table formatting
    const tableData = allRows.map(row => Object.values(row))

    // Get the headers by extracting the column names
    const headers = Object.keys(allRows[0])

    // Combine headers and data into a full table
    const fullTable = [headers, ...tableData]

    // Generate and print the ASCII table
    // Log the table
    createAsciiTable(fullTable, {
      outerBox: true,
      separatorHeader: true,
      paddingH: 1,
      paddingV: 0,
      headerColor: 'cyan',
      // cellColor: 'reset', 
      borderColor: 'white',
      maxFieldLength:24,
      ...tableOptions//overwrite with user options
    })
  }
}