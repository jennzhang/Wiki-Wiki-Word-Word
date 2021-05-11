# WIKI WIKI WORD WORD Readme
# CS361_Spring2021_400 Term Project
# Author: Jennifer Zhang
# Email: zhangjen@oregonstate.edu

Wiki Wik Word Word is the term project for the Spring 2021 term of Software Engineering I (CS361) at Oregon State University. 

Wiki Wiki Word Word is a web app that has two components:
	1. A website that:
		- Shows a term of the day and Wikipedia pages related to that term. 
		- A gui interface to a custom Wikipedia Search microservice + API documentation for developers who want to use the API
		- About and Contact pages with further information
	2. An API interface (here, integrated with the WWWW server).

Copy the files in /server to your server location.
Copy the files in /public_html to your website hosting location.

Note: For use of the server code, a new key and certificate need to be created in the same folder as the server file. For Linux shells, enter the below commands:
	openssl genrsa -out key.pem
	openssl req -new -key key.pem -out csr.pem
	openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
	rm csr.pem
The "rm csr.pem" command has been added since csr.pem is not used for this project. 
