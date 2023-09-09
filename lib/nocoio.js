const axios = require('axios');

class NocoDBClient {

    constructor(baseUrl, projectName, apiKey) {
        this.projectName = projectName;
        this.http = axios.create({
            baseURL: baseUrl,
            headers: {
                'xc-token': apiKey,
            },
        });
    }

    async findOne(tableName, id) {
        try {
            const response = await this.http.get(`${this.projectName}/${tableName}/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async updateOne(tableName, id, data) {
        try {
            const response = await this.http.put(`${this.projectName}/${tableName}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

   // NEW TO BE TESTED
   // NEW TO BE TESTED
   // NEW TO BE TESTED
    /*
    async findMany(tableName, filter) {
        try {
            // Convert the filter object to query parameters
            const queryParams = new URLSearchParams(filter).toString();
            
            const response = await this.http.get(`${this.projectName}/${tableName}?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    */
   // NEW TO BE TESTED
   // NEW TO BE TESTED
   // NEW TO BE TESTED

    async findMany(tableName, filter = {}, limit = 4, offset = 0) {
        try {
            const response = await this.http.get(`${this.projectName}/${tableName}`, {
                params: {
                    filter: JSON.stringify(filter),
                    limit,
                    offset
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteOne(tableName, id) {
        try {
            const response = await this.http.delete(`/${tableName}/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteMany(tableName, filter = {}) {
        try {
            const response = await this.http.delete(`/${tableName}`, { data: { filter: JSON.stringify(filter) } });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async insertOne(tableName, object) {
        try {
            const response = await this.http.post(`${this.projectName}/${tableName}`, object);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    //   express:router:route new '/api/v1/db/data/bulk/:orgs/:projectName/:tableName' +0ms
    // verify bulk oprations URL because likely should change
    async insertMany(tableName, objectsArray) {
        try {
            const response = await this.http.post(`${this.projectName}/${tableName}/bulk`, objectsArray);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = NocoDBClient;

