<div align="center">
 <h1>Borga Web App</h1>
 <p style="font-size: 1rem; margin-top: 1rem;"><a href="https://isel-pi-leirt-2122-1-g02r.herokuapp.com/" target="_blank">https://isel-pi-leirt-2122-1-g02r.herokuapp.com/</a></p> 
</div>

  
## 🚀 Getting Started

1.  **Necessary installations to run the application.**

    ```shell
    # Create package.json
      npm init –y
    ```

    ```shell
    # Module that brings Fetch API to node
      npm install node-fetch
    ```

    ```shell
    # Framework express
      npm install express
    ```

    ```shell
    # Middlewares
      npm install express-session
      npm install passport
    ```

    ```shell
    # Extension to use template engines in the web-site
      npm install handlebars
    ```

    ```shell
    # Framework for tests
      npm install jest --save-dev
      npm install supertest --save-dev
    ```

    ```shell
    # Framework express
      npm install express
    ```

    ```shell
    # Midlewares
      npm install express-session
      npm install passport
    ```

    ```shell
    # Extension to read the templates of web-site
      npm install handlebars
    ```

    ```shell
    # Support for the tests
      npm install jest --save-dev
      npm install supertest --save-dev
    ```

2.  **The next step is to open the package.json and change the test property to "jest" in the scripts object. Now we are ready to run the tests of the application.**

    Navigate into your new site’s directory and start it up.

    ```shell
      npm run test
    ```

3.  **Choose the way you want to store data.**

    Now you should open the borga-server.js file and comment the option that you don’t want.

    ```shell
    # Memory
      const borgaData = require('./borga-data-mem.js')

    # ElasticSearch
      const borgaData = require('./borga-db.js')
    ```

4.  **ElasticSearch**

    If you need to use ElasticSearch it will be necessary a previous installation of the package but also to execute some commands in the shell to create the documents necessary to support the application. Also, if you don't have Curl might consider installing it for managing your accounts in the application.

    <a href="https://www.elastic.co/pt/downloads/elasticsearch" target="_blank">Install ElasticSearch.</a><br/>
    <a href="https://curl.se/download.html" target="_blank">Install Curl.</a>

    ```shell
    # Start ElasticSearch
      elasticsearch
    ```

    ```shell
    # Delete to prevent data overlap
      curl -X DELETE http://localhost:9200/users
      curl -X DELETE http://localhost:9200/groups
    ```

    ```shell
    # Insert both documents in curl
      curl -X PUT http://localhost:9200/users
      curl -X PUT http://localhost:9200/groups
    ```

    ```shell
    # Insert both documents in curl
      curl -X PUT http://localhost:9200/users
      curl -X PUT http://localhost:9200/groups
    ```

    ```shell
    # Create a admin account
      curl -X POST --data "{\"userName\" : \"admin\", \"password\" : \"admin\", \"token\" :\"3fa85f64-5717-4562-b3fc-2c963f66afa6\" }" -H "Content-Type: application/json"             http://localhost:9200/users/_doc
    ```

    ```shell
    # Create an group for the admin
      curl -X POST --data "{\"name\" : \"MyGroup\",  \"description\" : \"Administration Group\", \"games\" : [], \"userName\" : \"admin\" }" -H  "Content-Type: application/json"       http://localhost:9200/groups/_doc
    ```

5.  **Start application**

    Open the shell in the applications directory and start it up!

    ```shell
      node borga-server.js
    ```

    Your site is now running at <a href="https://curl.se/download.html" target="_blank">http://localhost:8080</a>

<br>

## :european_post_office: Team

**LEIRT51D** <br>
Developed by Students:

<ul>
  <li> Gustavo Campos A47576
  <li> Tiago Cebola A47594
  <li> Inês Sampaio A47758
</ul>
