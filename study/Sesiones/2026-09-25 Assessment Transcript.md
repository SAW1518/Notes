---
title: 2026-09-25 Assessment Transcript
date: 2026-09-25
tags:
  - session
  - assessment
  - transcript
source: "Microsoft Stream recording — Assessment Session Invitation - Jesus Uribe (2026-09-25 14:05)"
---

# Assessment session — 2026-09-25

Raw transcript of the real EPAM A2 → A3 assessment, pulled from the Stream recording's auto-generated transcript (Teams, "AI-generated content may be incorrect"). Speech recognition errors are left as they came — e.g. "a sort" is Zod, "3D3GS" is Three.js, "SRC token" is CSRF token. Consecutive lines from the same speaker are merged; timestamps are where each turn starts.

Panel: Dzianis Spartak, Luiz Abbott, Ivan Stetsenko, Juan Perdomo.

---

**Jesus Uribe** 00:00:03
So I can share with you that I have more than four enterprise projects alongside my experience. And I have more than five certification, the major part of that in AI certifications. And as part of my highlight, I currently am working for For Johnson & Johnson, a coin and area of robotics, so as a fully stack engineer, so and in EPAM currently my my level is A2, I'm trying to go to the A3, so as of my part past back, sorry, ex stem clients. It was Expedia. I have been working for Expedia Group for four years, two here in EPAM, two in my previous employer, and during my work in Expedia, I received a small award. For accessibility for resolve accessibility tickets in 2025, I was the engineer with more story points in that part, so yeah, let's go to the next slide. So, my core... Technologies in general are React, but I know a few things from Java and backend site. So yeah, like I mentioned previously, my major part of the experience is at front end site, but you know, I making the role at the full stack and helping the backend and front end. Front inside, you can see my certifications. I got this this certification recently in the in the academy for sorry, Anthropic for EPAM Academy. If you want to scan the codes, you will to to read it and confirm the certifications. So, yeah, the course the core my core app. OK, is React, Next, Next, JavaScript, TypeScript, HTML, CCS, a few of Redbooks, and accessibility technologies, so... So, my current experience, or my current client, like mentioned previously, is Johnson & Johnson. So, it's a really good coin and project, because I will explain a bit what is the actual project. I'm working for, sorry, for Robotic Aria. Jason and Johnson have a few a few robots that uses uses uses for intervention and synergies in USA and in Europe. So, where where the use it for. make exploration, perform operations, and a lot of things that can be used at robots. So during the operation, the surgeon and the assistant can do three and four special things. One is take video or a long of or as a long of the operation. So, the robot have a small camera that can record all the operation inside of the body and outside, so the...

**Luiz Abbott** 00:03:35
Sorry, I cannot listen. Anyone can listen to Jesus.

**Jesus Uribe** 00:03:41
Hey, can you hear me now?

**Dzianis Spartak** 00:03:41
Yeah, yeah, I can hear it.

**Luiz Abbott** 00:03:43
Okay, now I can hear.

**Jesus Uribe** 00:03:44
Sorry, sorry, my headset just turned off. So, we're taking so during the operation, also the robot and the assistant can take images for posteriority, you know, check, and also the robot can make a scan print of the origins and the and the and the Pathway of the of the strategy, so during my part on on on this project I able to help the developing the developing the system to watch that videos and images trace with a 3D3GS helping to develop and developing. developing the microservices to manage the information. This is funny because I have a lot of experience in making agnostic cloud providers because, you know, in general, in Europe and USA have different rules. Related to the to the governance of the of the. Of the data, so, and in this project, I got a lot of experience trying to do the code agnostic dependent to the provider. So, and in this project, I got a recommendation from Matveev to go to the next level, which is assessment, right? So, as a part of my Experia project. I, like you mentioned previously, I was working for Expedia for four years, two here in EPAM, and two in my previous work, so in three major so well, so Expedia have a couple of sub brands like Expedia, Birbo, Hotels, Aguati, Trivago, Last Minute, and I was working of part. of the identity and profile and profile team providing authentication for the rest of the team and also giving support to the pages to the login, universal login, universal profile, universal management, and universal lineaitaliacom. I say universal because these three applications are universal for all the brands. So, as I, as I escape attributes, I have... I have helping to boil universal profile from zero, you know, before to any any acquisition of the of the Expedia group, all the application have his own profile page. We boil one universal application for that, for that one main developer for. Click stream or click click user track in general Expedia track the follow up or the of the clicks of the user around all the page. I I was a main developer in that in that site and and helping to migrating migrating one old suite. Sorry, in Expedia group, we have one big, small library of the component, which is in 2025, 2024. It was using an older version of Jest, and the increased the version was very, very hard. That's why we decide to switch the Jest component. the GSuite component to the Cypress component test. It was really funny. Yeah, and during my time in Expedia, I received an award for accessibility, fixed accessibility issues in all the pages. So this is my recently recommendation. I got a really good recommendation for My 2 oldest, my two last clients, one for Aneta, it was a senior manager engineering, my team lead, Alejandro Lopez, it was my team lead in in in Expedia, and Aleksandrova is my my sorry or. Or, or, sorry, is my actual team lead, and which is say, uh, Andrade for the next level. This is my batches and Certification. I really focus on the AI certification in this period, so this is my actual course that I have. I think that's all for myself.

**Dzianis Spartak** 00:08:17
Awesome, thank you. Juan, do you want to say something before we start about, he says, before we start?

**Jesus Uribe** 00:08:29
I'm sorry, my head had again disconnected. So it's okay since I switch fastly to the laptop to avoid disconnection between my audio. Sorry. Sorry.

**Dzianis Spartak** 00:08:39
Yeah, yeah, okay, that's fine. Alright, you, you need to tell me to kiss us.

**Jesus Uribe** 00:09:29
Sorry, I sorry, I don't know what happened with my headset. So, yeah, I'm ready for the questions. Thanks.

**Dzianis Spartak** 00:09:35
It's okay. Yeah, thank you for the really good self-presentation. A lot of achievements. And yeah, it was great. A little bit of an icebreaker question before we start. Like, do you know why developers prefer dark theme in the ID? Yeah, yeah, yeah, yeah, that's that's kind of concept.

**Jesus Uribe** 00:10:05
Throw in the ice ice things, or or avoid injuries in the ice, right? Yeah.

**Dzianis Spartak** 00:10:12
Yeah, all right, let's start then. I'm gonna go first with the questions, and the first set of questions will be technical expertise about like we are types, sorry, TypeScript, and etcetera. So, my first question will... If you have a large React application and when you're changing one piece of the global state, it costs like hundreds of the components to re-render. How would you investigate this problem and what approaches could you use to fix it?

**Jesus Uribe** 00:10:44
NE. So I think the initial point could be the developer tools, not the developer tool, could be React developer tools. You can like make a small overview to the about your components and you know you can perform the change and see what's component at the same time. Time, so to avoid it, in general, when you use React context, the native API for React, that disadvantages, right? Usually, if you prefer any change, all the entire components will change, so... To to avoid switch to the another library to the state, because you know, in general that switch, it's a lot of effort. We can use memorization, like like use memo or or rack dot memo to avoid. Unnecessary changes, but it's, you know, it's a really good application. We can start consider things like Red Saga or or not Redux. The next version of Redux could help, but you know is is is thing to consider is is not easy is the answer. Right there.

**Dzianis Spartak** 00:12:09
Mhm. Yeah, yeah, all right. Sounds good. Next question about TypeScript. Let's suppose that you have an API that can return several different response shapes depending on status. How would you model this in TypeScript so developers are focused? To handle every possible case.

**Jesus Uribe** 00:12:34
So, in this case, I will prefer use a sort libraries like a sort, because you know the the types on JavaScript have have a really good advantages, but you know when you transpile that to the JavaScript, usually that that verification. Doesn't work, especially if the if the is the responses change, so we can use libraries like a sort because our validation in runtime and you can create a safe a safe checks or or or or. Are. Our validation works as a promise. If one check fails, not throw high error and break the application, right? So that's my personal approach.

**Dzianis Spartak** 00:13:29
But if it's you, I don't know you. passing parameter and depends on this parameter. It can be, for example, user data or user data with. Bookings, I don't know, and so it's two types they can return the same endpoint, and you wanna check it during the not the runtime, but in TypeScript, like how can we do it?

**Jesus Uribe** 00:13:52
Mhm. Okay, so in that case, we can go for the design pattern, name it schemas. So, with the developer or the backend team, in this case, in this time is the same thing, right? We can acquire one schema and create. interfaces and types for type all the response and all the possibilities and avoid that type of the situation, right? And if you will perform any change in the backing of data that is skipped at the front end, but that's why I mention sort because if... If something on that communication breaks, in room time could happen things, right? So, but yeah, that's why I mentioned that at the beginning.

**Dzianis Spartak** 00:14:48
Okay, gotcha. All right. Let's move on to the next question. You worked with the uni personal login and session management across several Expedia brands, as you said. Can you walk us through how you would design Notification and session management across multiple applications or domains? What the security risk would you consider?

**Jesus Uribe** 00:15:17
OK, so the security risk in general is like we work in Expedia. In general, all the session lives in the in the in the in the token and the different token that we have, so the risk here is you in any attacker. Tech your, your, your, your. Your token can perform things in the application injected in the in the browser, right? So, to avoid it, we have a lot of like patterns or avoid one could be avoid a cross-site attack is where where where one attacker injects inject. JavaScript or code in URLs, inputs, or user patterns, and that could be fixed, having cookie read-only. I don't remember exactly the name is, and active the crucial check, you know. Security sensitive, and all check that have, so, but that opened the doors to the another type of attack that is closed. Script forward attack is when one attacker uses a authenticated user to perform authentication authentication. Queries or or request, so for that we can my my my favorite way to solve it this if you have any really complicated or or or. Or sorry, not complicated, sensitive data always ask for the password again. I know it's annoying for the user, but I think it's my my my personal, but we can we can do things like assign it information in the back end or or or also time use. SRC token, which is a small token that sent to the client, and if the request doesn't have that token, it fails.

**Dzianis Spartak** 00:17:28
Thank you. And next question, when would you choose server components like server side rendering, this is G or client side rendering in Next.js application? I think you noticed that you work with Next.js.

**Jesus Uribe** 00:17:46
Yeah, I think I prefer use a service rendering in because we have to to type of application promotional application and an internal application, right? The the the client is already in our in our application for promotional application is really. important have a good time of responses because the client have or the now have a really low latency, right? Really passing, right? So for promotional application, I prefer use server side because you don't know. What is the what is the the performance or the device of the client? We can have in our infrastructure the the heavy things and use share with the client the HTML and the and the these are ready processes to avoid the the the the device of the client. do heavy things or have a performance issue. For example, in internal application, again, with payment sites or especially, for example, when we manage a lot of information. like a list of the products or something like that. I prefer server-side rendering because to avoid the device of the user process that will, you know, arise and request is very happy and have it in our infrastructure infrastructure and use serve serve it to the client, right?

**Dzianis Spartak** 00:19:28
Mmhmm. Okay. Let's talk a little bit about AI, so you... have a lot of patches. I wasn't able to read it. It was a little bit small, but I guess you got your cloud code Certification, right? Oh, that's cool. Good job, good job. And let's talk a little bit about it. So my first question, what makes an AI agent? Different from simply sending to prompt to LLM.

**Jesus Uribe** 00:20:03
OK. Your question is related to the techniques to work with AI coding, for example, or comparing to the use and the prompt.

**Dzianis Spartak** 00:20:15
Yeah, like what's the difference if you're using an agent or you just sending a prompt to Claude?

**Jesus Uribe** 00:20:24
No, I, I usually, for example, actually our team is switching to the use spec kit driven driven, so it's a really good work type to work because of that way you can. Specify what is the output that you expect of your or of your of your code before to start write anything right? So, but anyway, I prefer one step before, so I use the AI, for example, in GN, we have... A lot of legacy code, a lot of legacy code. I use the AI for help me to to to find me in the what is the things that I need or change, because AI could accelerate that that part, right? I'm a traditional developer, usually go to the troll the application and check what is what is the things and trying to. Figurate in the application, there is really good for that part, and when I have the structural knowledge, I can pass to the spec driven, then you spec driven. A framework, right?

**Dzianis Spartak** 00:21:43
Mmh. Yeah, I know what talking about. Okay, let's move on. You said that you have an engine skill and your certifications. Can you explain what an agent skill is and when would you create a reusable skill rather than... Simply put in additional instructions into prompt.

**Jesus Uribe** 00:22:08
Sure, the skills are one practice that burns the last year, I think so. It's a way to inject a specific instruction for anything, right? So we can, we have a skills for... For UI, for backend UI, for accessibility things is the way that says to the AI. What is the good practices or the good follow that you they have to have for for get a better input? This is good because usually help us with the context because the MMS are training with a lot of information, a lot of information, and they... If you send any prompt without any context, a lot of that context losses because it's figured right, what is the topic that you are asking, and then put the LLM with the correct practices. With the skills, we skip that part and we tell it to the LM for do one specific thing with a good practice. And to configure, ohh, sorry.

**Dzianis Spartak** 00:23:27
Okay, Ihar. No, you could sorry if I interrupted you. So, next question about the sub agents. Did you use sub agents? Do you know this? And when would you delegate work to sub agents rather than letting one engine handle the entire work?

**Jesus Uribe** 00:23:51
For user sub agents, I prefer first use a plan mode to create the split the task in different sections or steps. And when it's possible, or we can create a parallel task, we can invoke sub agents. It's different for different tools. Cloud code compile load have a different ways to trigger that, but also is really good because when we have a cloud code session, if you execute. That step by step, the context is saving all that steps, right? With the super agent, we can use a wait for the output and don't spend the context of the main. Session right? It's really it's one my favorite thing for, because you know I know the context now is very big, but it's very all the safe.

**Dzianis Spartak** 00:25:01
Yeah, all right, gotcha, gotcha. Thank you, and maybe you can name what problem does MCP solve, model context protocol.

**Jesus Uribe** 00:25:14
Yeah, so the MCP is this acronym of the context model protocol and is there a way that connect different. technologies or tools to do our chat or agent, you know. So in the past we have to trigger APIs, but with this, you know, we en join to the room, to the authentication APIs and... And rate limit, etcetera. The MCPs come to fix fix this and and help us to to. to connect up tools to our clients, sorry, agents or chat. We have NCP, for example, for developer tools, browser, for example, we create a small API in Johnson & Johnson, we create a small MCP for the documentation. The AI can go to the JIRA and read the commentation very easily. Yeah, that type of things, so the MCPs.

**Dzianis Spartak** 00:26:29
Ivan, thank you. Okay, let's talk about a little bit about design decision and documentation skills. So, you mentioned leading the immigration to universal profile across Expedia brands. Can you tell us about one important architectural decision you personally influenced? Williams, if you had one, and what alternative did you consider and why was the selected solution preferred?

**Jesus Uribe** 00:27:03
So, that part of my journey and experience is really fun, because we, we was, we went the universal profile really fast, but the part of the shift production is it was complicated. Sorry for the French word, but... We still working at Azure trying to release the production for all the brands, so we have a lot of problems with the redirection with the redirection server, because we have two options: go. To the every single brand and replace the redirection URL, or use a server interceptor to avoid to avoid touch the code. We then we we select the the both of them, one for for for for for. Legacy brands are really legacy brands use the interceptor, because you know it's that code it was really stressful and complicated to touch, and the newest and the newest brands we chose the the traditional change URL, so it it it was good. Decision, because to to avoid increase the the technical debt in the legacy brand in legacy brands, we in the newest brand use use a traditional redirect.

**Dzianis Spartak** 00:28:44
Gotcha. All right, thank you. Next one, let's suppose your team decided to introduce Kafka communication between two services instead of synchronous REST. How do you document that decision so later an engineer joining your team can understand why it was made?

**Jesus Uribe** 00:28:58
Mhm. Okay, so the Kafka is really powerful when you are working with microservices because you avoid direct connection on all the and all the all the microservices, right? So with Kafka you can make that only.

**Dzianis Spartak** 00:29:26
I'm sorry, I didn't know what it is. My question was, how would you document it so later developers would understand why this change was made?

**Jesus Uribe** 00:29:33
Okay. Okay, for documentation, actually we are using a spec-driven UI in the code. But for documentation like in Jira or something similar, we create a van of the old sprint.

**Dzianis Spartak** 00:29:52
Mhm.

**Jesus Uribe** 00:29:58
We have a small task to document, and in their part with the comment the technical decision and all and all the all the things. At the end of the month, we share that information to the AI and create a new really structured rate. documentation and there is in general the technical decision and why is the thing happened.

**Dzianis Spartak** 00:30:25
Gotcha. Thank you. And a couple more questions. So you migrated the large React component package to Cypress. What problem you was trying to solve and how did you decide which test should be unit test, which should be component, which should be integration or end-to-end?

**Jesus Uribe** 00:30:48
Okay, so as part of my experience in in in Expedia, we we is not our decision team, you know, Expedia have a lot of layers and the engineer layer of couple of managers are of.

**Dzianis Spartak** 00:30:54
E.

**Jesus Uribe** 00:31:07
Of my manager, the site remove the unit test in Jest and switch it for yes component test is similar. Add to the to the end-to-end test, but is like you write unit test, like like you write yes component test, for example, when you run the the the the Cypress component test, you can select buttons and render. only the component that you need and make the unit test with visual. So with that, don't remove the rest of the test. You know, I have, we have end-to-end test and integration test, a small test, and the new version of the Cypress component model component component mode.

**Dzianis Spartak** 00:32:05
Okay, let's move on. Let's imagine a designer gives you a sketch of custom model window that visually looks correct. What must you verify before considering that component accessible?

**Jesus Uribe** 00:32:25
Okay. Before to start any any any design, we in Expedia we have one small spike in general, one is for design, it is already done, the second one is accessibility part, and we all all the team. sit and decide where specific. Tags we we use for accessibility, for example, in the in the dialogue we have a new tag specific for dialogue in HTML, so the regular the regular developers use use a V and that's it, but the people that cannot see well the page. Cannot read that is inside of the the right, so if it doesn't accessible, because usually in biggest component we use a system design, like I like, what is the what is the rule? Material UI, for example, have a lot of technical debt in accessibility. In that part, we can use ARIA labels that is the replace the behavior of the accessibility level of the tags, and there specific what is happening. To the screen reader, so yeah, it is not an easy answer because now it's complicated with the design system, but we have to do. choice decisions if we are using area labels or the correct tags.

**Dzianis Spartak** 00:34:12
Got you, and out of curiosity, are you testing with the screen readers when it is an accessibility?

**Jesus Uribe** 00:34:20
Can you repeat the question, sir?

**Dzianis Spartak** 00:34:22
Are you testing with the screen readers when you're testing accessibility?

**Jesus Uribe** 00:34:28
I use both dot both test in unit test you can. Check if the screen reader will be able to read the application, you know, scrapping if the one that have a specific layer or part, and in unit test, you can also create a specific accessibility test for. For the accessibility of the components, or the full page, for example.

**Dzianis Spartak** 00:35:00
Okay, thank you. If you would design the quality gates. What would you require before a pull request can be merged into a large production application?

**Jesus Uribe** 00:35:20
You mean the the the?

**Dzianis Spartak** 00:35:23
The quality gates is like when you use, and I don't know, kind of, yeah.

**Jesus Uribe** 00:35:25
Stone. Ohh. So. So, difference.

**Dzianis Spartak** 00:35:31
I don't know, kind of, sorry, let me finish. I know what kind of control version you're using, but I'm sure you, when you like before you pull request, either it's like GitHub, GitHub, or Bamboo before it can be merged. Goes through the checks like unit test and others, right? So, and... This is the part of quality gates. So what quality gates, what you established on your project for PR to be able to be merged?

**Jesus Uribe** 00:36:07
Okay, before is the define protocol to send the before to create the pull request. I would like prefer have a protocol to avoid lost time during the during the pull request. Provision, so one is, for example, test in.

**Dzianis Spartak** 00:36:27
Mhm.

**Jesus Uribe** 00:36:31
Test your changes in your local machine and add the screenshots of the unit tests, end-to-end tests, and all the tests that we have. So, when the pull request is already created, all the jobs that you have in the pull request jobs pass a unit test, sorry, unit test, end-to-end test, integration test if you have it. And a smoke text, and then when the pull request is already merged. In the in the in the ticket that we have for the for the storage, apply a screenshot of the public as working in a integration environment or in a test environment, so that type of ceremonies. Help to the all the team to make sure that the functionality is working right, so... That's mine.

**Dzianis Spartak** 00:37:24
OK, thank you. OK, for the time sake, I'm gonna ask last question and it's gonna be, tell us, tell us about the time when you strongly disagreed with another with another developer, maybe senior developer.

**Jesus Uribe** 00:37:24
Approach.

**Dzianis Spartak** 00:37:43
And the... On the technical decision, let's say, and how did you resolve it, and was and was your preferred solution out and selected?

**Jesus Uribe** 00:37:57
Okay, before to, you know, start any conversation with the other developer, is try to be sure that I... No, is is is legit or or is fundamentally with with any good practice. For example, is 1 developer is proposing one change in the code and and disagree have the arguments to be disagree. one design pattern or any documentation document or something like that. So to be sure that I'm correct because an avoid ego plays something in this conversation, right? So if another developer doesn't...

**Dzianis Spartak** 00:38:43
Mhm.

**Jesus Uribe** 00:38:47
How? doesn't release that this incorrect approach or bad approach, try to expose with the rest of the team, no, try to fight with the developer, try to... Take the decision as a team. Fundamentally, why the reason that we... Comes to the data decision, right?

**Dzianis Spartak** 00:39:14
Mm. Alright, so thank you. That was all for me for now, and yeah, Luis, please continue.

**Jesus Uribe** 00:39:23
Thanks.

**Luiz Abbott** 00:39:25
All right, thanks a lot, Dzianis. Pleasure to meet you, Jesus. My name is Luiz Abbott, and I will be the second expert asking you questions. So yeah, that's what I was going to say. As of now, if you want to take some sip of water, how are you doing? How are things so far?

**Jesus Uribe** 00:39:25
Very good. I'm really good, so I'm really a bit... What is that is nervous with this interview, but I think the client is going well. Alright, thanks for asking.

**Luiz Abbott** 00:39:53
Yeah, all right. Yeah, let's try to make an environment a bit easier, but I know how is it to be on the other side. So yeah, it's not that easy, even if you practice. But anyway, all right. Let's jump into the questions. All right, so you're talking about previously about server-side rendering and things like that. And I have a question regarding to that. Could you tell me why is React hydration a critical part of server-side rendering?

**Jesus Uribe** 00:40:24
Yeah, so when when one piece of the of the application is served by rendered, first the framework sends only the HTML, right? So, but at the same time, it started on lot of the scripts and the and the CCS. So, and you the user could chose the Scarlett on the page, but without functioning until the JavaScript downloads and link the function to the object to the buttons, for example, so that's why is the that happened with. Titus and rendering.

**Luiz Abbott** 00:41:08
All right, wonderful. Still talking about rendering, so could you tell me what is the critical rendering path and how can you optimize it for high traffic applications, web applications?

**Jesus Uribe** 00:41:20
So, the thing is... try to put the minor part of the application in our infrastructure, specifically the critical parts. For example, let's imagine that we have a catalog with products, and the user have to share all the products at the same time. We can create techniques to avoid the the the. When the user comes to the right legit page, it starts to fetch the products. We can use techniques like prefetching when the user goes over to the next page. Age, or, for example, if we have a lot of traffic. try to the essential parts of the page is only available for avoid the rest of the annoying of the application.

**Luiz Abbott** 00:42:28
But, like, could you tell me specifically about the critical rendering path?

**Jesus Uribe** 00:42:35
Critical could be a payment pay part or or when the when the articles are loading, so that part is really important because it is a user experience at the end of the day, and you should spend with money at the same time. Right.

**Luiz Abbott** 00:42:56
Okay, all right. Still talking a bit about front end applications. Could you compare the benefits, the advantages, and the drawbacks of using micro front ends?

**Jesus Uribe** 00:43:10
Yeah, so, in Expedia, we use Micro Frontends as a bundle, install it in the application or in the container application. The benefit is, we can isolate components in a... in one piece of code, for example, we can have only the avatar in a simple package, right? Or for example, the payment section relevant in a single component and be focused only in that component. And where the component is completed, install in the container application. We have a lot of techniques to do micro-frontend. One is create packages with NPM buildings, and we can not to recommend it, but you can also use... A-frames, noise no model, or noise no model, but it's another technique, and also we can inject JavaScript, but this is another bad practice, so my prefer now is it's have bundles installed in the main application.

**Luiz Abbott** 00:44:30
All right, but like you're talking about the some of the benefits, right? Talk to me about the downsides of having micro-frontends.

**Jesus Uribe** 00:44:40
Now, OK, so... The one could be the the. The process, because, for example, when we have to perform any change, you have to go first and modify that part of the of the of the application and install could be two or three pull requests and more the production time, the release of production time. Another thing is the communication between the microphones will be complicated, because if you do have any good practices using, for example, context API or something for something like that, you can really, really have problems with that. And also having a lot of rendering.

**Luiz Abbott** 00:45:32
Mhm.

**Jesus Uribe** 00:45:33
Things with the content, right?

**Luiz Abbott** 00:45:34
Okay, all right, let's go a bit on to the AI side, right? So you talked a bit about it and I would like to understand what are the strategies that you use and how do you usually structure your prompt?

**Jesus Uribe** 00:45:49
On Mai. Sorry, my first approach is read the what I have to is read the the the the ticket, compare the the ticket specs with actually what is in production, and with this fully understand, go to the to the. Put any agent for a start with the research, because we cannot perform any change without understand at 100% what's happening with the code from a perspective. I don't know if you have any to protect with, so in just in that part, start with... With any prompt, or for example, any spec driven the code, so starting with write all the specification that we need, specifying files or techniques or... Maybe, and that prompts go to the any agents. I start with a plan mode and ask for the AI that create me a plan for this and create me a the MC file, and depending what is give me the AI, I decide if we will use a sub agents or not. and start with the performance things.

**Luiz Abbott** 00:47:15
Okay. All right, and see about the AI. Do you know what is RAG? What problems does it solve and how does it work?

**Jesus Uribe** 00:47:27
Rack OK.

**Luiz Abbott** 00:47:28
Rag.

**Jesus Uribe** 00:47:30
Ah, rack, yeah, okay. With Iraq, let we say in our team, the documentation is the first place that of the trust and also the layers. So the thing is with the before the AI, the documentation. It's updated when someone's unupdated, so with the rack, we can have pass that documentation to the one LN model and ask, for example, ask team or or try to find any unupdated. part of the documentation is really powerful, especially in a biggest team or with different product teams. It's really powerful for that part.

**Luiz Abbott** 00:48:27
And how does it work under the hood?

**Jesus Uribe** 00:48:32
Do you mean the connection or or or?

**Luiz Abbott** 00:48:34
Rug itself, the process you have said that you can use to read documentation, but essentially, how does that work? Like, how is it able to read it right?

**Jesus Uribe** 00:48:42
OK, you can do it.

**Luiz Abbott** 00:48:44
Because it's a bit different if you just ask it to read the documentation and give you the information, right?

**Jesus Uribe** 00:48:50
Yeah, so you can have two approach use pass NCP to the JIRA and read all the documentation, but you know this could consume a lot of context. You can create embeddings for avoid for avoid and a vectorial. A vectorial database creating embeddings of the documentation and passes to the AI to avoid spend a lot of context reading all the single all of the single files at the same time, right? So, my preference is use embeddings for... For the AI and the AI read data embeddings. to answer you without spend too much context.

**Luiz Abbott** 00:49:36
All right. Sorry, sorry to say this, but I may be interrupting you whenever it's okay to answer so that I can have enough time for the other questions, okay? All right, yeah, it's a question regarding software design. So could you explain me kindly the solid principles and give me a Brief explanation doesn't need to go into examples of each one of them.

**Jesus Uribe** 00:50:01
Okay, the principle of design, the design pattern, sorry.

**Luiz Abbott** 00:50:04
Solid principles.

**Jesus Uribe** 00:50:05
Sorry, the E is for single responsibility, O is for open to close, open to extends, and close for modification. L is for list scope, is 1 subtype should be able to replace. Do their fathers type in any part of code? It's D, no, L, no. So A is for, I don't remember the exactly name, but this is the mean of the principle is. No client should be forced to reuse of interface function is not needed. It very have a several interfaces with. With. Singh responsibility, and the last one is the V is for, I don't remember the SQLs, the acronym, but it means that that no higher component should be dependent of the level of the low level components. I have a few examples of them, but...

**Luiz Abbott** 00:51:15
Okay.

**Jesus Uribe** 00:51:17
We can continue with.

**Luiz Abbott** 00:51:17
Yeah, no, that's all right. Thank you a lot. Okay, and let's talk about some other principles. Do you know about the first principles in testing?

**Jesus Uribe** 00:51:27
In testing. Um... I have knowledge about testing, but the principle like that, I don't know, sorry.

**Luiz Abbott** 00:51:39
Yeah, okay, no worries. Still regarding testing, do you know about the testing pyramid?

**Jesus Uribe** 00:51:48
Parameter.

**Luiz Abbott** 00:51:50
Pyramid, pyramid. Like the Pyramids from Egypt.

**Jesus Uribe** 00:51:58
It, it's a, no, I'm sorry, I, I don't wear it.

**Luiz Abbott** 00:52:04
Okay, I did write it down if it was confusing my spelling. Testing pyramid or pyramid.

**Jesus Uribe** 00:52:11
No, I didn't either, and I didn't hear never that, sorry.

**Luiz Abbott** 00:52:16
Okay, no worries, no worries about it. Okay. Let's talk about communications. OK, so we know about web sockets.

**Jesus Uribe** 00:52:26
Yeah.

**Luiz Abbott** 00:52:27
Okay, so when would you use a long polling strategy over a web socket? And what would you take into consideration when choosing that?

**Jesus Uribe** 00:52:39
Okay, I have a good example of this. For example, if you have to upload big files, for example, to the R patch, imagine that we have a big file, we can create a web socket to inform or Or report the progressive of the of the upload that socket, we can create that one single on simple. HTTP request to start with another micro servers with the start uploading the file, open the stream, and with the macro web socket we can report the progressive of that. Of that progression of that updating. part. So it's one example. One more will be notifications or one more could be the loading part of the videos. You can inform the status or with the web dockets. It's really powerful and have a lot of cases of use.

**Luiz Abbott** 00:53:54
Okay, but you're saying to choose a web socket, but like the idea is like long polling over web sockets, right? Not to use web sockets, but a long polling strategy.

**Jesus Uribe** 00:54:06
Low police strategy.

**Luiz Abbott** 00:54:08
Yeah.

**Jesus Uribe** 00:54:12
No, I don't, I don't think any strategy for that, so...

**Luiz Abbott** 00:54:17
You did, you did give a good example for for that would be notifications, but how would be long polling better than a web socket for notifications?

**Jesus Uribe** 00:54:18
Mm. Nope. These 2 things, right? One is web socket, that one is full polling, right? Or OK.

**Luiz Abbott** 00:54:35
Yes, yeah, we we can do it both strategies. Do for notifications. Maksim.

**Jesus Uribe** 00:54:42
Yeah, we can use it, but I don't know. I can figure out what way to implement it. So, no, sorry.

**Luiz Abbott** 00:54:49
Okay, yeah, no worries at all. Let's talk a bit about security. So... Uh... Could you tell me what is a content security policy and what problem does it solve?

**Jesus Uribe** 00:55:06
Sure, context-correct policy is a tag in in HTML is usually it's for avoid in general it's for avoid SSRF attacks and cross-site scripting attacks. which is avoid injecting, for example, JavaScript in inputs on URL patterns, and also help us with avoid inject anything in our page. Not only JavaScript could be HTML and CCS.

**Luiz Abbott** 00:55:44
All right, wonderful. You mentioned all about the HTTP, right? So could you tell me what's the difference between HTTP 1.1, the first version, basically, with the second version? What were the improvements made on version 2?

**Jesus Uribe** 00:55:59
Sure, the HTTP one have a lot of actually have a lot of. In convention, because, because then in the new version, it's really focused in increase the performance and use all the all the all the all the performance of their machine, for example, increases the the simultaneous connection in each one it was 6. Five, and now is is used. Is is optimized to use all the all the all the bandwidth that assigned for the browser, so we have a lot of improvements in animations and also with the strings. In general, these are really increases capacities of the. The first, the first version.

**Luiz Abbott** 00:56:52
Mhm. Anything else before besides simultaneous connections that you can remember?

**Jesus Uribe** 00:56:59
For example, if we have a lot of promises in the preferred version, we have only. Sorry, not promises, connections for our request. We can have only five in the virtual, and now we can, as much as we can of the browser. This is one example.

**Luiz Abbott** 00:57:23
Okay, thank you. All right, let's talk about code quality. So which code quality tools you have used and how they impacted in the Teams code base?

**Jesus Uribe** 00:57:38
Actually, we use a sonar queue is for it's a common library for for fine different back practices in general. We can also create their lint rules to, for example, we use a... Lean rules of Brazil, and we have a custom rules for our team, so another thing will be a sonar in, but not only in the code in the browser, sorry, not in the browser, in the pull request job. We can, we have a sonar queue with a bit more powerful capacities, so that type of practice helps us to avoid bad practices or, or, or the code.

**Luiz Abbott** 00:58:33
Okay. All right. And just to wrap up with my questions, could you tell me how do you handle technical debt in the team and how to organize it and distribute it among the team?

**Jesus Uribe** 00:58:46
Okay, so it's not universal answer in this topic, but the thing is, try to always have the business value at 100% or as a priority, right? So it's not worth it, a user factor by refactor, because the code looks... But it's very always a way to the when we have to touch the code anyway and perform the improvements, no full refactor improvement about that part in the same change, or, for example, if we have a legacy code or legacy application that we mentioned in. In the previously answers, we have, for example, a legacy application. It's very not touched, and if we need a new feature, try to create it in a newer application and apply redirects or install models. to avoid tortured legacy code, especially if really, really old.

**Luiz Abbott** 00:59:50
And how do you organize and distribute it?

**Jesus Uribe** 00:59:55
Um... Organized at a team level.

**Luiz Abbott** 01:00:00
Yes.

**Jesus Uribe** 01:00:01
Okay, so we usually have one epic with tickets to name it the depth with a small feature that we have fixed. For example, one big example that I fixed the last week, we have this could be a... Long story, but let me go fast. We have problems with the governance data in our project, and we use all the other regions, AWS, but in Europe, and we don't have one server that we need. In European, then next year we will release the product in European, and I took one ticket to make agnostic the code for Azure, for example, and when we release it in European. We use, we use the new code for avoid problem with the governance.

**Luiz Abbott** 01:01:07
Okay, but sorry, I couldn't understand like how... How do you separate that? Like there's technical depth to do. Who is going to take it? How is it going to be? That's what I want to understand.

**Jesus Uribe** 01:01:17
Okay, you the organization, you mean, okay, sorry.

**Luiz Abbott** 01:01:20
Yeah, team level.

**Jesus Uribe** 01:01:22
Okay, so we can have a take the epic, and when any developer have time or we have a, let me imagine that one developer and his responsibility before or to the end of Sprint can take that. Technical debt tickets.

**Luiz Abbott** 01:01:45
Okay, that sounds really good. Thanks a lot, Jesus, for your patience. Now, Ivan, please, if you can, you are. Able to start your questions.

**Ivan Stetsenko** 01:01:57
Yeah, thank you, Luiz. Hey, nice to meet you, Luiz. I'm Ivan. I will be last expert. I'll try to, you know, have more light questions for the end of the session. You're doing good so far, so...

**Jesus Uribe** 01:02:14
Yes.

**Ivan Stetsenko** 01:02:16
Keep it up, okay? All right, so I saw you move to the more backend Java project in February. So what I'm looking for from you is like maybe you can share a decision or like solution or feature, you know, you were responsible building end to end. Not just, you know, like you contributed wise, but something that you've built end to end.

**Jesus Uribe** 01:02:48
Let me please, I understand the question. The question is, we I have a product and I have to release to the to the market. What is the way to go to the production or or or?

**Ivan Stetsenko** 01:03:02
No, no, my question is about your experience. So you moved to the back-end side, right, of the development.

**Jesus Uribe** 01:03:09
Mhm. Yeah.

**Ivan Stetsenko** 01:03:11
So question is, what, you know, since February you joined the new stack, what can you share like feature you built personally on the back end? Not like contributed to, but I'm looking end to end, how like any feature you've built from scratch to end.

**Jesus Uribe** 01:03:17
Mmhmm. Okay. Around all the way around. OK, so OK, so. I just mentioned, but I took one agnostic ticket to be able to hosting our images for AWS or Azure, so to avoid problem with the regulations. So, the thing is...

**Ivan Stetsenko** 01:03:52
Mhm.

**Jesus Uribe** 01:03:53
All the application, it was building for AWS and Bracel, so with en European we don't have available, so available some service that we need in AWS, so and Bracel doesn't have. governances, securities, especially with healthy things. We have to move the UA applications to the AWS in European site and also create agnostic code to save.

**Ivan Stetsenko** 01:04:19
Mmh.

**Jesus Uribe** 01:04:32
in AWS or Azure Bob services in European site. This is my work the two or three weeks ago. Also help with the Path Viewer component using 3D3DS that mentioned in the presentation. We we have 3D scans of the origins that can perform the I I helped to build the the 3DS component for be able to visualize it in the user, so that's two. I think it's less, but you know I have. Six months in there, right?

**Ivan Stetsenko** 01:05:13
Yeah, yeah, that's enough. Okay, got it. Another question. So you mentioned you are more on the React side of things, but you know, like my question is, we have 3 frameworks that are like, no. Most used right now, it's Angular, View, and React. So imagine you are rolling into a new project where you have to decide which framework to use. And what I'm looking in your answer is like, how would you understand? Which, which framework is to use?

**Jesus Uribe** 01:05:54
The first thing is always consider all the team, right? Because my expertise is in React, but for example, if I join to the new project, the major part of them is knows Angular. I have to learn Angular, or, for example, if the application is already... in Angular is and is no legacy code and we don't have to migrate anything. Continue with Angular, for example. My personal preference never have to take a role at the sign at the time to take that type of decisions.

**Ivan Stetsenko** 01:06:19
Mhm. Okay, makes sense. Let's say you are the only developer. Beyond you is like, let's say tech lead is also joined. So 2 of you, you and the tech lead join new project and you have to define the stack. So you can choose whatever framework you would want to choose and you know, the team is gonna fill in. So how would you understand which framework is most suitable for each solution?

**Jesus Uribe** 01:07:04
That's what really depend on the product, because, for example, I know that Angular have a really good. advantages, especially in the render specs. For example, if I have to create any really performance page that we can't use, for example, service rendering, my choice is Angular, for example.

**Ivan Stetsenko** 01:07:29
Mm.

**Jesus Uribe** 01:07:32
Or, for example, if we have a really critical part, like a payment or list of the products, we can, for example, use server side rendering depending if React or Angular, so totally depend on the of the of the product.

**Ivan Stetsenko** 01:07:46
Mmh. Okay, in which scenario you would choose view?

**Jesus Uribe** 01:07:57
Mm. I think is we have to do fancy things because Angle View have a lot of things for animations or for CCS translation, for example, and View it was the first framework that adopt natively. That that that behavior, or yeah, I don't know too much view, but but I know what is the advantages of you.

**Ivan Stetsenko** 01:08:28
Okay, well, you have to at least, you know, on a high level, understand what is the benefits of each and where to choose it. But I'm more than satisfied with your answer, so we can move further on. And I will be moving to AI section. We talked a lot about the AI. I just have a couple of questions. They are more like hands-on based on your experience. So did you have, like, and maybe you can tell me about the time when you was doing the research with AI and it led you or pointed you in the wrong direction and how you understood that?

**Jesus Uribe** 01:09:09
But. This question is more related to the who use the correct. Uh, practices of V.I. or, or, or who I chose, for example, one model to other model.

**Ivan Stetsenko** 01:09:26
So it's more about like... Did you ever had a case where you was like, you know, doing research with AI and the AI said, this is good, we should, I don't know, use this technology. And you understood that, hey, this is probably not the right, you know, direction you pointed me to.

**Jesus Uribe** 01:09:43
Okay. No.

**Ivan Stetsenko** 01:09:50
and how you understood that.

**Jesus Uribe** 01:09:50
No way. Okay, so in general, is always use the criteria for the AI have a lot of knowledge, but you know, the UI usually is training with the different aspects of the life. One is the code, one is the sensuality and physics, you know.

**Ivan Stetsenko** 01:10:00
Mhm.

**Jesus Uribe** 01:10:13
The I have a lot of things, but you have to identify when is the is is appointing to the to the bad bad answer, because he's contaminated with another context. For example, always use your. criteria as engineer and use your experience as the first to guide what is the real response or the correct response. Not because AI have a lot of knowledge, is the source of truth, right?

**Ivan Stetsenko** 01:10:46
Okay, but let's say you're doing research in some area that you are not an expert. You have never, I don't know, somebody asked you to...

**Jesus Uribe** 01:10:58
Medical health, we are not expert in medical health.

**Ivan Stetsenko** 01:10:58
Like, do. Yeah, so like you're not an expert and you're doing research with AI, so how would you understand if AI is right or not?

**Jesus Uribe** 01:11:04
Yeah. Okay, so for example, I have a good example in my Excel project. We have contractors, doctors for providers. Mentoring, and we have one AI from Johnson and Johnson, but we have a big, small cartel. Please go with the with the doctor before to choice any any any any answer, always.

**Ivan Stetsenko** 01:11:28
Mhm.

**Jesus Uribe** 01:11:41
Ask for the pencil that I know have the right question and share the information and asking this is correct and this is information will take this decision. Always put all in place in the plate and ask for always have ask for. For. Mentory, and if I don't have, for example, in this, I don't have, for example. Expert of this, I can, for example, ask another another LM models or use the Google and try to to get more information to take one real decision, right?

**Ivan Stetsenko** 01:12:25
Okay, makes sense. Then, okay, then how do you understand when to not use AI? So most of the times people are just using AI for everything. So how would you understand where, you know, probably I shouldn't use AI, you know, in this scenario?

**Jesus Uribe** 01:12:48
If the regulation is don't be able to use AI, so, or, for example, when you have a really simple things like read or understand a document, the major part of the people use. give that document to the AI and explaining things. I think it's about practices because you are doing really faster to your work, but you don't really understand the information. Or when, for example, I have to do things with the banks or sensitive data of the user. I know that the politics of the information in the AI is really strong, but I prefer use a normal coat or a real person for these things. This is my personal approach.

**Ivan Stetsenko** 01:13:43
Okay, yeah, I'm looking mostly for your, you know, personal opinion. Okay. Then another question outside of AI stuff. So as a senior engineer, right, one of the critical things of work is to understand the priorities and be able to delegate the work.

**Jesus Uribe** 01:14:03
Mhm.

**Ivan Stetsenko** 01:14:03
So let's say you have two features, right? You worked on one feature, you like 60% done with this feature, and then the new priority is coming. Let's say like there is a production critical bug, so they need a senior to solve this bug.

**Jesus Uribe** 01:14:20
Okay.

**Ivan Stetsenko** 01:14:21
I am a junior engineer, so you need to do me a handoff of this feature you had 60% complete. So you can switch to this more critical bug. How would you do this handoff to me?

**Jesus Uribe** 01:14:29
Okay. Okay, this situation, unfortunately, is really common, especially in products that are already in production. So, is you asking me? I always prefer have one person eat in super role in every sprint. So. And, for example, let's imagine that that person needs more help for fixed it book, because it's a huge book. Always have the person with more experience helping to that person, or, for example, never... Put all the team in the book, because usually, usually is not a good practice, because we could the progress.

**Ivan Stetsenko** 01:15:23
No, yeah, I understand that. My question is more about we already in this position where you had featured that you completed like on 60% completion and you need to transfer this feature to me and you need to, you know, basically explain me what needs to be done there, what was done.

**Jesus Uribe** 01:15:39
OK.

**Ivan Stetsenko** 01:15:45
et cetera. So like, let's say, I don't know.

**Jesus Uribe** 01:15:47
Okay, I accept knowledge transfer.

**Ivan Stetsenko** 01:15:50
Yes, yes, this kind of...

**Jesus Uribe** 01:15:51
Okay, thank you. So... One we have, I prefer a lot of practices. For example, when you will end your day, if you have any advances, always make a comment at the end of the day, because, for example, in this situation, let's imagine that one developer... Have to not work one day, and we have to end that feature always have a small documentation with a ticket, and if, for example, we have a stack driven to what is. Done, and what is missing, or another good practice is split the task in a in a...

**Ivan Stetsenko** 01:16:33
Mhm.

**Jesus Uribe** 01:16:40
in a small pieces and watching what part did you stay to then another developer continues. Hopefully, releases things. For example, let's imagine that the task is... Carla. One step could be create the embeddings. Second step could be upload that embeddings to the database. Second step could be connect that embeddings to the LLM. If you stay in one of that part, say to the new developer, I'm here, then your next step is there. That's it.

**Ivan Stetsenko** 01:17:24
Okay, so basically you have. you have split the ticket into the sub tickets, you have all the details and commits, and you just send all of this to me and say, like, hey, here's what I've done. Go ahead and complete. Okay.

**Jesus Uribe** 01:17:43
Exactly.

**Ivan Stetsenko** 01:17:46
Okay, got it. So, I've seen a... People like the reviewers and people who provided feedback for this promotion of yours, they pointed almost everything at four and five, but they rated your communication as three or five. So like personally, how do you think, what is the... You know this area of improvement, um, that you know need to happen, so you would be on the like on the same level as other metrics.

**Jesus Uribe** 01:18:24
Yeah, actually I have a lot of courses on English. I have, for example, if you prefer me, I have a really big score in the lingo or my, I will be honest with you, the English is a long with my life is was a problem. Recently I have a... Might be might be too level, so, and when I try to communicate with my partner, especially in English, in general, it's okay, but with I I I have a wrong answer, some things, or more structural English. So, in your need to fix this, I have one specific English professor, and also, you know, my screen lingua is really important for me.

**Ivan Stetsenko** 01:19:16
Okay. Yeah, I totally understand that. Do you think there is anything like beyond the English that you feel like also might need in a comment?

**Jesus Uribe** 01:19:28
Sorry, can you repeat? Sorry.

**Ivan Stetsenko** 01:19:30
Yeah, I was saying, like, if we say, if we avoid like saying English is a problem, do you think there was anything else you feel like might be need an improvement or you feel like English is the main?

**Jesus Uribe** 01:19:46
Maybe it could be. No, I think the English is the only problem. I, I, as I can identify, I don't know if the other person has another approach, but yeah.

**Ivan Stetsenko** 01:19:57
Okay. Okay, got it. Totally, totally makes sense. Okay, can you tell me about the time you had to give a tough feedback to someone? As an example, like, you might be not code wise, right? Maybe someone behaved wrongly at the, you know, at the meeting or... Somebody completely misunderstood the task and, and you know, implemented the code in the wrong way, and it is the last day of the sprint. How would you, how would you approach this, like giving of tough feedback?

**Jesus Uribe** 01:20:33
Okay. Okay, so.

**Ivan Stetsenko** 01:21:02
Mhm.

**Jesus Uribe** 01:21:03
Understand any any sprint to helping. I prefer full understand the problem that that person that have to, for example, maybe they don't understand one ticket. My first up is go understand that ticket, asking what is to that person what is. Needed for understand fully the ticket and not from the person, try to focus first in the real problem and save my my my my help, maybe in the feedback says put more attention in meeting. or something like that. But always try to improve the person before to make any annoying or language to the person, right?

**Ivan Stetsenko** 01:21:50
Okay, so let's imagine like you gave me the feedback, right? What happened is that I, during the entire sprint, I told her that, hey, my work is almost done. I'm 90% done. And then on the last day, you know, you learned that I've not done anything, basically.

**Jesus Uribe** 01:22:08
Yeah.

**Ivan Stetsenko** 01:22:08
You talk to me, we have like a plan aligned and you know, you provided all the support and I tell you, yes, I understand that. That's my bet. I'll try my best. And next sprint, same thing happening.

**Jesus Uribe** 01:22:23
Okay.

**Ivan Stetsenko** 01:22:24
So, what, what would you do in the in this case?

**Jesus Uribe** 01:22:27
The thing is, check if the if the if the story points or the or the charts of the of the work is correct. Maybe I over over share that person that person with a lot of tickets or maybe we. Measuring correct the story points and check what is happening. If the problem is the change of the work, try to fix it for the next sprint. We have a meeting for that, right? So we have retros, we have plannings, try to... Put the attention in that part to be really to be really secure that the problem is the charge of the work. If not, provide feedback. Maybe you all aren't enough for this sprint. Let's check what's happened. Or create a meeting with that specific person. Maybe they have a personal problems or something like that. And always. Try to try to find the problem and understand the person.

**Ivan Stetsenko** 01:23:42
Okay, makes sense. All right, and probably the last question I have. Can you, so imagine I'm a product owner, right? And you did the research and you basically need me to explain me. multiple like technical solutions. Basically, the question is, how would you explain something that is tough technically to a non-technical person?

**Jesus Uribe** 01:24:18
It's hard sometimes because we are as developer, we assume that the my person, my part of the person knows things, but in my part of the case is not. Try to explain the features and the technical things.

**Ivan Stetsenko** 01:24:26
Ave.

**Jesus Uribe** 01:24:36
as user. For example, putting imaginary situation of the person, you are user and you receive that input. For behind, that happens or try to simplify that as much as I can. for the real person can understand me. Never assume that the person is understand specific things and ask, always ask, do you use this to me? Do you miss something? And try to always.

**Ivan Stetsenko** 01:25:06
Mhm.

**Jesus Uribe** 01:25:15
clarify all the things to avoid problem communications.

**Ivan Stetsenko** 01:25:20
Okay, so imagine you explain that to me like, hey, there is a, I don't know, this, we have to do this feature this way. And because of that, we need like, I don't know, a week of time. And then I come back to us and I say, hey, I just talked to ChatGPT and he told me that it could be done. It's a wrong, you know, proposal that you have. It could be done in three days, and we should use this library. And I'm your product owner.

**Jesus Uribe** 01:25:45
And. Okay. In these cases, I always consider the information, not because I am a programmer and I know things. I have the truth of all the other things. Always consider the information and contrast with the real thing or technology that we have. Maybe that library is not compatible with our system. Or maybe doesn't have a security, a security. A security checks always consider the information, but always contrast with the real situation of the team and the technology that we will use, and explain why no and why see, sorry, why no and why is used or not.

**Ivan Stetsenko** 01:26:39
Okay, so you told me that, hey, this is not compatible, and I'm saying, you know, ChatGPT told me that it is compatible. We should use this, we should use this library and do it the way I want it.

**Jesus Uribe** 01:26:50
Oh. Or maybe ChatGPT told me something and I can apply it depend on the situation, but you know, ChatGPT can search around all the internet and maybe find something that I not always consider the information and not discard it because he's not a technical person. Maybe information, and I can use it to fix any problem or any feature.

**Ivan Stetsenko** 01:27:14
Mm. Okay. All right. That's probably it for me. Thank you for your answers. And Johnny, some... And I sent back to you.

**Jesus Uribe** 01:27:34
Thanks. Thanks.

**Dzianis Spartak** 01:27:34
Thank you, thank you, Ivan. Thank you, Jesus, for all your answers. It was a really good conversation, and now it's time for you to ask questions, to ask if you have any.

**Jesus Uribe** 01:27:50
Um... No, not too much for now. It was a really good conversation. Thanks for all the all the all the all the ask asking, and I will study what I don't answer, especially two or three. two or three questions that I have no idea. Thanks for this information. I will use for... For continuing permit, thanks for all.

**Dzianis Spartak** 01:28:24
All right, thank you. We have 5 business days to provide feedback to Juan, and he will communicate it after with you.

**Jesus Uribe** 01:28:36
Thanks so much.

**Dzianis Spartak** 01:28:36
Alright, thank you everybody, and have a great rest of your day.

**Luiz Abbott** 01:28:41
Thanks guys, have a great rest of the day and a great weekend. Bye bye.

**Jesus Uribe** 01:28:41
Bye.

**Ivan Stetsenko** 01:28:42
Thanks, all.

**Juan Perdomo** 01:28:44
Thank you.

**Jesus Uribe** 01:28:45
If we can, bye bye.

**Ivan Stetsenko** 01:28:45
Yeah, great weekend everybody. Bye bye.

**Dzianis Spartak** 01:28:45
Okay.
