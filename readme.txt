Question: Write a node.js server that takes a number from the client , saves it, returns it based on another call, and modifies it based on a third call.  The number should be saved in RIAK.


Program Solution:
The program will create a TCP Server and also 1 client (socket) connection. This client will send a number and the server will perform the following:
1.Receive a digit from client
2.Save it using a call back to retrieve the data
3.Upon data retrieval a call back is issue to modify the data. 
4.Data will be modified (incremented by one) and saved.
5. Steps 2-4 are done in a callback loop for 3 times. At the end of each iteration, the new value is send back to the client. I 

Notes:
I wanted to really understand node.js's callback loop and events and added a bonus step in creating the loop(step 2-4). If time permitted, I would have sent error messages back to the client if they sent a non-digit. Also, for the looping, I would have liked to include the client-sending data once it receives it from the server. 

Challenges: 
I had to build riak from scratch since Riak doesn't have a package installer for 32-bit computers. This took a few hours to figure out. 
Intro to NoSQL, a bit of a learning curve. 
Learning Node, riak-js and express took some time as well. 

Conclusion: This was a great excercise and Node has definately piqued my interest. 








