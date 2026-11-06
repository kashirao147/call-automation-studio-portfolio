from pathlib import Path
import importlib.util

from docx import Document


ROOT = Path(r"C:/Users/W T/Documents/aiprojects/AIVoiceAgentPortfolio")
OUT_DIR = ROOT / "output" / "aiou_assignments"
OUT_DIR.mkdir(parents=True, exist_ok=True)

base_builder = Path(r"C:/Users/W T/Documents/aiprojects/AIVoiceAgentPortfolio/tmp_aiou/build_aiou_assignments.py")
spec = importlib.util.spec_from_file_location("base_builder", base_builder)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

setup_document = mod.setup_document
add_cover = mod.add_cover
add_heading = mod.add_heading
add_answer_block = mod.add_answer_block
add_references = mod.add_references


def save_assignment(filename, course_title, course_code, assignment_no, units, level, questions, refs):
    doc = Document()
    setup_document(doc)
    add_cover(doc, course_title, course_code, assignment_no, units, level)
    add_heading(doc, "Questions and Answers", level=1)
    for i, item in enumerate(questions, start=1):
        add_answer_block(doc, i, item["question"], item["answer"])
    add_references(doc, refs)
    doc.save(OUT_DIR / filename)


ASSIGNMENTS = [
    {
        "filename": "8604_Assignment_1.docx",
        "course_title": "Research Methods in Education",
        "course_code": "8604",
        "assignment_no": "1",
        "units": "Units 1-4",
        "level": "B.Ed",
        "refs": [
            "AIOU Soft Book: Research Methods in Education (Code 8604), especially units on knowledge, educational research, research classifications, historical research, correlational research, and experimental research.",
            "AIOU Spring 2026 assignment sheet for Course 8604.",
        ],
        "questions": [
            {
                "question": "Describe different sources of knowledge by giving examples and explain the need and significance of conducting educational research.",
                "answer": {
                    "intro": "Human beings acquire knowledge through several sources, but not all sources are equally accurate or dependable. In education, understanding these sources is important because teachers and researchers need to move from casual belief toward systematic inquiry.",
                    "sections": [
                        {
                            "title": "Different Sources of Knowledge",
                            "paragraphs": [
                                "One source of knowledge is tradition. People often believe or do something because it has been practiced for a long time. For example, a school may continue using a rigid homework system simply because it has always done so. Tradition can preserve useful experience, but it may also continue weak practices without question.",
                                "A second source is authority. Knowledge is sometimes accepted because an expert, teacher, religious scholar, or institution says it is correct. For instance, a trainee teacher may adopt a classroom strategy because a senior supervisor recommends it. Authority is helpful, but it should not replace evidence.",
                                "A third source is personal experience. Individuals learn from direct interaction with events. A teacher may conclude that group work increases participation because he or she has seen it happen in class. Experience is valuable but may remain limited or biased if not examined carefully.",
                                "A fourth source is reasoning. Deductive and inductive thinking help people draw conclusions from principles and evidence. For example, a teacher may infer that frequent feedback improves learning because students perform better after guided correction.",
                                "The fifth and strongest source in formal inquiry is scientific research. Here knowledge is generated through systematic observation, data collection, analysis, and verification. This source is more dependable because it reduces guesswork and allows conclusions to be tested.",
                            ],
                        },
                        {
                            "title": "Need for Educational Research",
                            "paragraphs": [
                                "Educational research is needed because education deals with human learning, behavior, institutions, curriculum, and policy, all of which are complex and changing. Teachers and administrators cannot depend only on habit or opinion when making decisions.",
                                "Research helps identify educational problems accurately. For example, if students are performing poorly in mathematics, research can determine whether the issue lies in teaching method, language, prior knowledge, attendance, or assessment design.",
                            ],
                            "bullets": [
                                "It helps improve teaching methods and classroom practices.",
                                "It provides evidence for curriculum revision and policy development.",
                                "It supports diagnosis of learner difficulties and institutional issues.",
                                "It encourages objective thinking instead of assumption-based decisions.",
                            ],
                        },
                        {
                            "title": "Significance of Educational Research",
                            "paragraphs": [
                                "The significance of educational research lies in its ability to improve the quality of education. It contributes to better planning, more effective instruction, stronger assessment, and informed administration. Research also helps teachers become reflective practitioners rather than routine workers.",
                                "Another significant role is innovation. New teaching approaches, technologies, inclusion strategies, and school reforms often emerge from research-based inquiry. In this way research acts as a bridge between theory and practice.",
                            ],
                        },
                    ],
                    "conclusion": "Knowledge comes from tradition, authority, experience, reasoning, and scientific research, but educational research provides the most systematic and reliable path for solving educational problems. Its need and significance lie in improving teaching, learning, planning, and decision-making through evidence rather than assumption.",
                },
            },
            {
                "question": "Differentiate between basic and applied research by giving examples and explaining the process of conducting action research to solve educational problems.",
                "answer": {
                    "intro": "Basic and applied research both generate knowledge, but they differ in purpose and immediate use. Action research is a more practical and local form of inquiry that directly helps educators solve classroom or school-level problems.",
                    "sections": [
                        {
                            "title": "Basic Research",
                            "paragraphs": [
                                "Basic research is conducted to expand theoretical understanding and build knowledge without necessarily aiming at immediate practical use. Its major purpose is explanation and concept development.",
                                "For example, a researcher may study how intrinsic motivation develops across different age groups in order to contribute to educational psychology. The findings may later help practice, but the immediate goal is knowledge generation.",
                            ],
                        },
                        {
                            "title": "Applied Research",
                            "paragraphs": [
                                "Applied research focuses on solving a practical problem. It uses scientific methods, but its orientation is toward improvement in real settings such as classrooms, schools, programs, or communities.",
                                "For example, a researcher may test whether peer tutoring improves reading achievement among grade five students in a specific district school. The purpose is direct educational improvement.",
                            ],
                        },
                        {
                            "title": "Difference Between Basic and Applied Research",
                            "bullets": [
                                "Basic research aims at theory building, while applied research aims at practical problem-solving.",
                                "Basic research contributes to general knowledge, while applied research focuses on immediate use.",
                                "Basic research may be more abstract, while applied research is more context-bound.",
                            ],
                        },
                        {
                            "title": "Process of Conducting Action Research",
                            "paragraphs": [
                                "Action research is usually carried out by teachers, heads, or practitioners to improve their own work setting. It begins with identification of a real problem, such as low classroom participation or weak homework completion.",
                            ],
                            "numbers": [
                                "Identify and define the problem clearly.",
                                "Review relevant ideas or previous practices related to the problem.",
                                "Formulate an action plan or strategy for improvement.",
                                "Collect baseline data through observation, tests, checklists, or interviews.",
                                "Implement the action in the classroom or school setting.",
                                "Collect follow-up data after implementation.",
                                "Analyze the results and reflect on what improved and what still needs change.",
                                "Revise practice and, if needed, begin another cycle.",
                            ],
                        },
                        {
                            "title": "Educational Value of Action Research",
                            "paragraphs": [
                                "Action research is especially valuable because it is local, practical, and immediately useful. It empowers teachers to solve their own problems scientifically and to improve instruction through reflection and evidence.",
                            ],
                        },
                    ],
                    "conclusion": "Basic research broadens theoretical knowledge, applied research solves practical problems, and action research helps practitioners improve specific educational situations. Together they show that research can serve both knowledge development and direct educational improvement.",
                },
            },
            {
                "question": "Differentiate between types of research by purpose and types of research by method and write a detailed note on correlational research.",
                "answer": {
                    "intro": "Research can be classified in more than one way. Two common bases are purpose and method. Understanding both classifications helps the student recognize why a study is conducted and how it is carried out.",
                    "sections": [
                        {
                            "title": "Types of Research by Purpose",
                            "paragraphs": [
                                "Research by purpose is classified according to the goal or intention of the study. Common examples include basic research, applied research, and action research. In some contexts evaluative research is also included because it examines the worth or effectiveness of a program or policy.",
                                "This classification answers the question: why is the study being conducted?",
                            ],
                        },
                        {
                            "title": "Types of Research by Method",
                            "paragraphs": [
                                "Research by method is classified according to the procedure or design used to collect and analyze data. Common types include historical research, descriptive research, correlational research, experimental research, survey research, and case study research.",
                                "This classification answers the question: how is the study conducted?",
                            ],
                        },
                        {
                            "title": "Correlational Research: Meaning",
                            "paragraphs": [
                                "Correlational research examines the relationship between two or more variables. It does not manipulate variables like an experiment. Instead, it studies whether changes in one variable are associated with changes in another.",
                                "For example, a researcher may investigate the relationship between study habits and academic achievement, or between teacher feedback and student motivation.",
                            ],
                        },
                        {
                            "title": "Features of Correlational Research",
                            "bullets": [
                                "It focuses on naturally occurring variables.",
                                "It measures the degree and direction of relationship.",
                                "It does not establish cause-and-effect with certainty.",
                                "It is useful where experimentation is difficult or unethical.",
                            ],
                            "paragraphs": [
                                "A positive correlation means both variables move in the same direction, while a negative correlation means they move in opposite directions. Zero correlation suggests no meaningful relationship.",
                            ],
                        },
                        {
                            "title": "Process of Correlational Research",
                            "numbers": [
                                "Select the variables to be studied.",
                                "Define them operationally so they can be measured.",
                                "Choose a suitable sample.",
                                "Collect data using valid tools such as tests, scales, questionnaires, or records.",
                                "Compute the correlation coefficient.",
                                "Interpret the direction and strength of the relationship carefully.",
                            ],
                        },
                        {
                            "title": "Importance and Limitation",
                            "paragraphs": [
                                "Correlational research is important because it helps researchers identify associations that may guide prediction and further study. It is particularly useful in education, where many variables such as attitude, performance, attendance, and motivation interact with one another.",
                                "Its main limitation is that correlation does not prove causation. If two variables are related, it does not necessarily mean one causes the other. A third factor may influence both.",
                            ],
                        },
                    ],
                    "conclusion": "Research by purpose explains why a study is carried out, while research by method explains how it is conducted. Correlational research belongs to method-based classification and is valuable for examining relationships among educational variables, though it must be interpreted carefully because relationship is not the same as cause.",
                },
            },
            {
                "question": "Describe historical research in your own words and explain the importance and process of conducting historical research.",
                "answer": {
                    "intro": "Historical research is the systematic study of past events, ideas, institutions, persons, and developments in order to understand present conditions and future directions. It is not simple storytelling; it is a disciplined attempt to reconstruct and interpret the past on the basis of evidence.",
                    "sections": [
                        {
                            "title": "Meaning of Historical Research",
                            "paragraphs": [
                                "In educational settings, historical research may examine the development of educational policies, curriculum reforms, institutions, teacher education, or social movements related to learning. For example, one may study the evolution of examination systems in Pakistan or the history of female education in a certain province.",
                            ],
                        },
                        {
                            "title": "Importance of Historical Research",
                            "paragraphs": [
                                "Historical research is important because present educational systems are shaped by past decisions, values, and conditions. If researchers understand the roots of current policies and practices, they can interpret present issues more intelligently.",
                            ],
                            "bullets": [
                                "It helps explain the origin and development of educational institutions and ideas.",
                                "It provides lessons from past successes and failures.",
                                "It supports policy understanding by linking current practice with historical context.",
                                "It deepens critical thinking and perspective in educational analysis.",
                            ],
                        },
                        {
                            "title": "Process of Conducting Historical Research",
                            "numbers": [
                                "Select and define the historical problem clearly.",
                                "Determine the scope in terms of period, place, and focus.",
                                "Locate relevant sources such as documents, records, letters, reports, minutes, newspapers, and archives.",
                                "Examine source authenticity through external criticism.",
                                "Evaluate source accuracy and meaning through internal criticism.",
                                "Organize the evidence into themes or chronological patterns.",
                                "Interpret the findings and write the report logically.",
                            ],
                        },
                        {
                            "title": "Sources Used in Historical Research",
                            "paragraphs": [
                                "Historical research depends on primary and secondary sources. Primary sources include original documents such as official records, diaries, speeches, and archival papers. Secondary sources include books, articles, and reports written later by other scholars.",
                            ],
                        },
                    ],
                    "conclusion": "Historical research helps educators understand how past ideas and events influence present educational realities. Its importance lies in explanation, perspective, and policy learning, while its process requires careful problem definition, source evaluation, and evidence-based interpretation.",
                },
            },
            {
                "question": "Define different variables related to experimental research and explain the detailed process of designing and conducting an experiment in the field of education.",
                "answer": {
                    "intro": "Experimental research is one of the strongest methods for studying cause-and-effect relationships because it involves deliberate manipulation and control. To understand this design properly, students must first understand the variables used in it.",
                    "sections": [
                        {
                            "title": "Variables in Experimental Research",
                            "paragraphs": [
                                "The independent variable is the factor deliberately introduced or changed by the researcher. For example, a new teaching method may be used as the independent variable.",
                                "The dependent variable is the outcome that is measured to see the effect of the independent variable. For instance, students' achievement scores may be the dependent variable.",
                                "Control variables are factors the researcher attempts to keep constant so that they do not interfere with the results, such as time, content coverage, or classroom conditions.",
                                "Extraneous variables are outside factors that may affect the dependent variable unintentionally, such as prior knowledge, motivation, or home support. Researchers try to reduce their influence.",
                                "In some studies, moderator variables or intervening variables may also be discussed because they change the strength or pathway of the effect.",
                            ],
                        },
                        {
                            "title": "Process of Designing and Conducting an Educational Experiment",
                            "numbers": [
                                "Identify the educational problem and formulate a clear hypothesis.",
                                "Define the independent and dependent variables operationally.",
                                "Select participants and assign them to experimental and control groups if the design requires comparison.",
                                "Ensure both groups are comparable at the start, often through a pretest or matching.",
                                "Administer the treatment or intervention to the experimental group while the control group receives the usual method or an alternative condition.",
                                "Maintain control over time, content, and procedure as far as possible.",
                                "Collect post-test data after the intervention period.",
                                "Analyze results statistically and interpret whether the treatment made a significant difference.",
                            ],
                        },
                        {
                            "title": "Educational Example",
                            "paragraphs": [
                                "Suppose a researcher wants to test whether cooperative learning improves science achievement. Two similar groups of students are selected. One group is taught through cooperative learning, while the other is taught through lecture method. After a fixed period, both groups are tested and their results compared.",
                            ],
                        },
                        {
                            "title": "Value and Caution",
                            "paragraphs": [
                                "Experimental research is valuable because it provides strong evidence about effectiveness. However, in educational settings full control is often difficult because students differ in background and real classrooms cannot always be manipulated like laboratories. Therefore, careful design and ethical practice are essential.",
                            ],
                        },
                    ],
                    "conclusion": "Experimental research uses variables such as independent, dependent, control, and extraneous variables to study cause and effect. Its detailed process includes hypothesis formulation, group selection, treatment administration, control of conditions, and comparison of outcomes. When carefully designed, it is highly useful for testing educational interventions.",
                },
            },
        ],
    },
    {
        "filename": "8604_Assignment_2.docx",
        "course_title": "Research Methods in Education",
        "course_code": "8604",
        "assignment_no": "2",
        "units": "Units 5-9",
        "level": "B.Ed",
        "refs": [
            "AIOU Soft Book: Research Methods in Education (Code 8604), especially units on descriptive research, data collection tools, sampling, research proposal, and research report writing.",
            "AIOU Spring 2026 assignment sheet for Course 8604.",
        ],
        "questions": [
            {
                "question": "Differentiate between experimental and descriptive research and explain the different types of descriptive research briefly by giving valid examples.",
                "answer": {
                    "intro": "Experimental and descriptive research differ mainly in purpose and design. One tests causal effect through manipulation, while the other describes existing conditions, characteristics, or relationships without experimental control.",
                    "sections": [
                        {
                            "title": "Difference Between Experimental and Descriptive Research",
                            "paragraphs": [
                                "Experimental research involves manipulation of an independent variable to see its effect on a dependent variable under controlled conditions. It seeks to answer causal questions such as whether a new teaching strategy improves achievement.",
                                "Descriptive research, on the other hand, does not manipulate variables. It studies what exists in the present and aims to describe conditions, opinions, practices, traits, or relationships. For example, a study of students' attitudes toward online learning is descriptive.",
                            ],
                        },
                        {
                            "title": "Types of Descriptive Research",
                            "paragraphs": [
                                "Survey research collects information from a sample through questionnaires, interviews, or schedules. Example: surveying secondary school teachers about classroom discipline problems.",
                                "Case study research examines one person, institution, class, or event in depth. Example: an in-depth study of one inclusive school and its support practices.",
                                "Observational research focuses on behavior as it occurs naturally. Example: observing student participation patterns during group work.",
                                "Comparative descriptive research compares two or more groups on selected traits. Example: comparing study habits of urban and rural students.",
                                "Developmental or trend studies describe change over time without full experimentation. Example: studying change in reading habits across grade levels.",
                            ],
                        },
                    ],
                    "conclusion": "Experimental research is designed to test cause and effect, while descriptive research is designed to describe and interpret existing reality. The various types of descriptive research provide flexible tools for studying educational conditions without manipulating them.",
                },
            },
            {
                "question": "Explain the significance of research tools/instruments for data collection and write detailed notes on any two of the following: questionnaire, interview protocol, achievement test.",
                "answer": {
                    "intro": "Research tools or instruments are the practical means through which data are collected. Their significance is very high because even a strong topic and good design can fail if the researcher uses weak or unsuitable instruments.",
                    "sections": [
                        {
                            "title": "Significance of Research Instruments",
                            "bullets": [
                                "They convert research objectives into measurable data.",
                                "They influence reliability, validity, and accuracy of findings.",
                                "They help ensure consistency in data collection.",
                                "They determine whether the data truly reflect the problem under study.",
                            ],
                        },
                        {
                            "title": "Questionnaire",
                            "paragraphs": [
                                "A questionnaire is a written list of questions used to gather information from respondents. It may include open-ended, closed-ended, rating-scale, or multiple-choice items. It is useful when data are needed from many people in a relatively short time.",
                                "The questionnaire is especially effective in survey research because it is economical and can cover a wide sample. However, its success depends on clarity, brevity, relevance, and logical order of questions.",
                                "A good questionnaire should avoid ambiguity, double-barreled questions, and unnecessary length. It should also be piloted before final use to check whether respondents understand it properly.",
                            ],
                        },
                        {
                            "title": "Interview Protocol",
                            "paragraphs": [
                                "An interview protocol is a planned guide containing the sequence of interview questions, prompts, instructions, and recording arrangements to be followed by the interviewer. It brings structure and consistency to the interview process.",
                                "It is especially useful when the researcher wants detailed responses, clarification, or deeper understanding of attitudes and experiences. In educational research, interview protocols are often used with teachers, students, heads, or parents.",
                                "A good interview protocol begins with simple and rapport-building questions, moves to core questions, includes optional probes, and ends respectfully. It should align clearly with research objectives and avoid leading or biased wording.",
                            ],
                        },
                    ],
                    "conclusion": "Research tools are significant because they determine the quality of evidence collected. A questionnaire is useful for broader written data collection, while an interview protocol helps gather deeper and more nuanced responses. Proper design of both tools increases the trustworthiness of research findings.",
                },
            },
            {
                "question": "Differentiate between probability and non-probability sampling and explain in detail different types of random sampling techniques by giving valid examples.",
                "answer": {
                    "intro": "Sampling is the process of selecting a portion of a population for study. The two broad categories are probability sampling and non-probability sampling, and they differ mainly in whether each member of the population has a known chance of selection.",
                    "sections": [
                        {
                            "title": "Probability vs Non-Probability Sampling",
                            "paragraphs": [
                                "In probability sampling, each member of the population has a known and usually equal chance of being selected. This improves representativeness and supports stronger generalization.",
                                "In non-probability sampling, selection depends on convenience, judgment, availability, or purpose rather than random chance. It is useful in some practical situations, but it is more vulnerable to bias.",
                            ],
                        },
                        {
                            "title": "Types of Random Sampling Techniques",
                            "paragraphs": [
                                "Simple random sampling means every member has an equal chance of selection. Example: selecting 50 student names by lottery from a school enrollment list.",
                                "Systematic random sampling means selecting every nth member after a random start. Example: after choosing a random starting point, every 10th student record is selected from a list.",
                                "Stratified random sampling means dividing the population into strata such as gender, locality, or grade level and then selecting randomly from each stratum. Example: selecting boys and girls separately so both are properly represented.",
                                "Cluster random sampling means selecting whole groups or clusters instead of individual members. Example: choosing four schools randomly from a district and studying all teachers in those selected schools.",
                                "Multistage random sampling combines stages of random selection. Example: first selecting districts, then schools within districts, and then students within selected schools.",
                            ],
                        },
                    ],
                    "conclusion": "Probability sampling is based on chance and supports better generalization, while non-probability sampling is based on convenience or judgment and is less representative. Different random sampling techniques help researchers choose samples according to population structure and study needs.",
                },
            },
            {
                "question": "Define a research proposal and explain the significance and process of developing a good research proposal.",
                "answer": {
                    "intro": "A research proposal is a formal written plan that presents what the researcher intends to study, why the study is important, and how it will be conducted. It is essentially a roadmap for the research project.",
                    "sections": [
                        {
                            "title": "Significance of a Research Proposal",
                            "paragraphs": [
                                "The proposal is significant because it gives direction and clarity before the actual study begins. It helps the researcher refine the topic, organize thoughts, review the literature, and anticipate methodological requirements.",
                                "A good proposal also allows supervisors, committees, or funding bodies to judge whether the study is relevant, feasible, ethical, and academically worthwhile.",
                            ],
                        },
                        {
                            "title": "Process of Developing a Good Research Proposal",
                            "numbers": [
                                "Select a clear and researchable topic.",
                                "State the problem and explain its context.",
                                "Write the objectives and, where appropriate, research questions or hypotheses.",
                                "Review relevant literature to show background and gap.",
                                "Describe the methodology including population, sample, tools, and procedure.",
                                "Explain how data will be analyzed.",
                                "Include delimitation, significance, and ethical considerations.",
                                "Prepare a realistic timeline and references.",
                            ],
                        },
                    ],
                    "conclusion": "A research proposal is the blueprint of the study. Its significance lies in providing clarity, feasibility, and academic direction, while its development process requires careful attention to problem statement, objectives, methodology, and planning.",
                },
            },
            {
                "question": "Differentiate between a research proposal and a research report and discuss the main sections/components of a research report.",
                "answer": {
                    "intro": "A research proposal and a research report are both important research documents, but they belong to different stages of the research process. One presents the plan before the study, while the other presents the completed work after the study.",
                    "sections": [
                        {
                            "title": "Difference Between Proposal and Report",
                            "paragraphs": [
                                "A research proposal is written before conducting the study. It explains what the researcher intends to do and how the study will be carried out.",
                                "A research report is written after the study is completed. It presents the actual findings, analysis, interpretation, and conclusions of the research.",
                            ],
                            "bullets": [
                                "Proposal = future plan; report = completed study.",
                                "Proposal seeks approval; report communicates results.",
                                "Proposal contains expected method; report contains actual findings and discussion.",
                            ],
                        },
                        {
                            "title": "Main Sections of a Research Report",
                            "numbers": [
                                "Title page",
                                "Abstract or summary",
                                "Introduction and statement of the problem",
                                "Objectives, questions, or hypotheses",
                                "Review of literature",
                                "Methodology",
                                "Data analysis and presentation of findings",
                                "Discussion and interpretation",
                                "Conclusion and recommendations",
                                "References and appendices",
                            ],
                            "paragraphs": [
                                "Each section has a specific purpose. The introduction explains the study background, the methodology shows how the study was conducted, the findings section presents evidence, and the discussion interprets what the results mean in relation to the objectives and earlier literature.",
                            ],
                        },
                    ],
                    "conclusion": "The proposal and the report are related but not identical. The proposal plans the research, while the report documents and interprets the completed study. A good research report follows a systematic structure so that readers can understand the problem, method, findings, and conclusions clearly.",
                },
            },
        ],
    },
    {
        "filename": "8605_Assignment_1.docx",
        "course_title": "Educational Leadership and Management",
        "course_code": "8605",
        "assignment_no": "1",
        "units": "Units 1-4",
        "level": "B.Ed",
        "refs": [
            "AIOU Soft Book: Educational Leadership and Management (Code 8605), especially units on Islamic administration, management and administration, resource management, supervision, and project planning.",
            "AIOU Spring 2026 assignment sheet for Course 8605.",
        ],
        "questions": [
            {
                "question": "Discuss the fundamental principles of Islamic administration. And explain how administrators in Pakistani institutions are following these principles.",
                "answer": {
                    "intro": "Islamic administration is based on moral responsibility, justice, accountability, and service to humanity. It does not treat authority as a privilege for domination, but as an amanah or trust that must be exercised with honesty and fairness.",
                    "sections": [
                        {
                            "title": "Fundamental Principles of Islamic Administration",
                            "bullets": [
                                "Amanah: authority is a trust and must be used responsibly.",
                                "Adl: justice and fairness in decisions, distribution, and treatment.",
                                "Shura: consultation with relevant people before important decisions.",
                                "Accountability: leaders remain answerable to Allah and society.",
                                "Equality and dignity: people should be treated with respect regardless of status.",
                                "Welfare orientation: administration should serve collective good, not personal interest.",
                            ],
                            "paragraphs": [
                                "These principles make Islamic administration deeply ethical. A leader is expected to be truthful, transparent, and humble, and to avoid favoritism, exploitation, and corruption.",
                            ],
                        },
                        {
                            "title": "Application in Pakistani Institutions",
                            "paragraphs": [
                                "In many Pakistani institutions, these principles are visible to some extent in practices such as committee decision-making, distribution of duties, welfare measures, and moral expectations from administrators.",
                                "For example, school heads often consult staff on timetables, annual planning, and events, which reflects shura. Rules about fair admissions, discipline, and staff conduct also show attempts to uphold justice and accountability.",
                            ],
                        },
                        {
                            "title": "Critical View",
                            "paragraphs": [
                                "However, practice is uneven. In some institutions, favoritism, political pressure, delay in decision-making, and weak accountability reduce the true spirit of Islamic administration. Therefore, while the principles are widely acknowledged, their actual implementation still needs strengthening.",
                            ],
                        },
                    ],
                    "conclusion": "Islamic administration is grounded in trust, justice, consultation, accountability, and public welfare. Pakistani administrators often recognize these principles, but the extent of real implementation varies. Stronger commitment to ethical leadership is needed to bring institutional practice closer to these ideals.",
                },
            },
            {
                "question": "Management functions and administration functions are often considered the same. Differentiate among the functions of management and administration with the help of examples.",
                "answer": {
                    "intro": "Management and administration are closely related, but they are not exactly the same. Administration is usually concerned with policy direction and broad decision-making, while management focuses more on implementing plans and running day-to-day operations.",
                    "sections": [
                        {
                            "title": "Functions of Administration",
                            "paragraphs": [
                                "Administration usually deals with setting goals, framing policies, approving programs, and making major institutional decisions. In education, it may include policy formation, long-term planning, and coordination with higher authorities.",
                                "For example, deciding school expansion policy or approving the annual development plan is largely administrative in nature.",
                            ],
                        },
                        {
                            "title": "Functions of Management",
                            "paragraphs": [
                                "Management focuses on planning work execution, organizing resources, directing staff, supervising implementation, solving operational problems, and evaluating daily performance.",
                                "For example, preparing staff duty rosters, arranging classrooms, monitoring attendance, and ensuring smooth examination conduct are management functions.",
                            ],
                        },
                        {
                            "title": "Key Difference",
                            "bullets": [
                                "Administration decides what is to be done; management decides how it will be done.",
                                "Administration is broader and policy-oriented; management is operational and execution-oriented.",
                                "Administration often works at higher decision levels; management functions more directly at implementation level.",
                            ],
                        },
                    ],
                    "conclusion": "Administration and management are interconnected but distinct. Administration provides policy direction and institutional goals, while management turns those decisions into practical action. Educational institutions need both for smooth and purposeful functioning.",
                },
            },
            {
                "question": "Human resource management and financial management are essential components of any organization. As a manager, how you will manage human resources and financial resources?",
                "answer": {
                    "intro": "Human and financial resources are central to institutional success. A good manager must ensure that people are motivated and competent, while finances are planned, controlled, and used transparently.",
                    "sections": [
                        {
                            "title": "Managing Human Resources",
                            "bullets": [
                                "Select staff on merit and according to institutional need.",
                                "Define duties clearly and avoid role confusion.",
                                "Encourage teamwork, communication, and mutual respect.",
                                "Provide professional development and performance feedback.",
                                "Recognize good work and address conflicts fairly.",
                            ],
                            "paragraphs": [
                                "As a manager, I would treat staff as the most important institutional asset. Effective human resource management means placing the right person in the right role, maintaining morale, and creating a culture of accountability and support.",
                            ],
                        },
                        {
                            "title": "Managing Financial Resources",
                            "bullets": [
                                "Prepare a realistic budget according to priorities.",
                                "Ensure transparent spending and proper record keeping.",
                                "Monitor income and expenditure regularly.",
                                "Prevent waste and misuse through controls and approval procedures.",
                                "Use available funds in ways that directly support learning and institutional goals.",
                            ],
                            "paragraphs": [
                                "Financial management requires planning, honesty, and prioritization. Educational funds should be allocated to areas such as staffing, materials, maintenance, and student support according to actual needs rather than personal preference.",
                            ],
                        },
                    ],
                    "conclusion": "A good manager handles human resources through fair staffing, motivation, development, and supervision, and manages finances through planning, accountability, and wise allocation. Balanced management of both resources is necessary for institutional effectiveness.",
                },
            },
            {
                "question": "Critically examine the techniques of supervision. Also explore which techniques are mostly to be used by our supervisor and why.",
                "answer": {
                    "intro": "Supervision is an important educational function aimed at improving teaching and institutional effectiveness. Its techniques vary according to purpose, context, and style of leadership, and their value depends on how they are used.",
                    "sections": [
                        {
                            "title": "Common Supervision Techniques",
                            "paragraphs": [
                                "Classroom observation is one of the most common techniques. The supervisor observes teaching directly and later provides feedback. This is useful because it connects supervision with real classroom practice.",
                                "Conference technique involves face-to-face discussion between supervisor and teacher to reflect on problems, strengths, and improvement areas. It supports professional growth through dialogue.",
                                "Demonstration teaching is another technique in which a skilled teacher or supervisor models effective teaching practice. It is helpful when teachers need practical guidance rather than abstract advice.",
                                "Workshop and group discussion techniques are also important because they address shared professional needs collectively.",
                            ],
                        },
                        {
                            "title": "Critical Examination",
                            "paragraphs": [
                                "Observation is powerful, but if used only for fault-finding, it creates fear. Conferences are constructive, but they require communication skill and trust. Demonstrations are useful, though they may become less effective if they are unrealistic or disconnected from local classroom conditions.",
                            ],
                        },
                        {
                            "title": "Techniques Mostly Needed in Our Context",
                            "paragraphs": [
                                "In our educational context, supportive classroom observation, post-observation conference, and workshop-based supervision are among the most suitable techniques. These are needed because many teachers require practical feedback, encouragement, and professional development rather than only inspection.",
                                "Supervisors should use these techniques because they improve teaching while maintaining dignity and cooperation. In many institutions, teachers are more likely to improve when supervision is developmental rather than punitive.",
                            ],
                        },
                    ],
                    "conclusion": "Supervision techniques such as observation, conference, demonstration, and workshops all have value, but their effectiveness depends on how they are applied. In our context, supportive and improvement-oriented supervision techniques are most useful because they strengthen teaching without creating unnecessary fear or resistance.",
                },
            },
            {
                "question": "Define Project. What are the necessary things for planning a project in an educational setting?",
                "answer": {
                    "intro": "A project is a planned and organized set of activities designed to achieve specific objectives within a defined period, budget, and scope. In education, projects may focus on infrastructure, learning improvement, teacher training, technology integration, or community involvement.",
                    "sections": [
                        {
                            "title": "Necessary Things for Educational Project Planning",
                            "numbers": [
                                "Clear statement of need or problem",
                                "Specific and achievable objectives",
                                "Defined target group and beneficiaries",
                                "Detailed activities and implementation steps",
                                "Time schedule and work plan",
                                "Human, material, and financial resource requirements",
                                "Monitoring and evaluation mechanism",
                                "Risk assessment and sustainability planning",
                            ],
                            "paragraphs": [
                                "A well-planned project should begin with a real educational need, such as low reading levels or shortage of science equipment. Objectives should then be stated clearly, activities arranged logically, and responsibilities assigned carefully.",
                            ],
                        },
                    ],
                    "conclusion": "An educational project is a purposeful and time-bound plan for improvement. Good planning requires clear objectives, proper resource estimation, scheduling, implementation strategy, and evaluation. Without these elements, project work may become confused and ineffective.",
                },
            },
        ],
    },
    {
        "filename": "8605_Assignment_2.docx",
        "course_title": "Educational Leadership and Management",
        "course_code": "8605",
        "assignment_no": "2",
        "units": "Units 5-9",
        "level": "B.Ed",
        "refs": [
            "AIOU Soft Book: Educational Leadership and Management (Code 8605), especially units on student classification, budgeting, school record, curriculum administration, and evaluation of management.",
            "AIOU Spring 2026 assignment sheet for Course 8605.",
        ],
        "questions": [
            {
                "question": "What is the concept of student classification? Write the criteria of student classification.",
                "answer": {
                    "intro": "Student classification refers to the organized grouping of students according to selected educational criteria so that teaching, administration, guidance, and support can be managed more effectively.",
                    "sections": [
                        {
                            "title": "Criteria of Student Classification",
                            "bullets": [
                                "Age and grade level",
                                "Achievement level or academic ability",
                                "Interest and aptitude",
                                "Special educational needs or support requirement",
                                "Attendance and behavior pattern where relevant",
                            ],
                            "paragraphs": [
                                "The purpose of classification is not to label students unfairly, but to improve teaching organization and learner support. Good classification should be flexible, fair, and based on educational need.",
                            ],
                        },
                    ],
                    "conclusion": "Student classification is a practical administrative and instructional process. Its criteria may include age, achievement, aptitude, needs, and behavioral considerations, but it should always be used to support better learning rather than to create stigma.",
                },
            },
            {
                "question": "What is the concept and scope of budget? Describe the functions of budget.",
                "answer": {
                    "intro": "A budget is a financial plan that estimates expected income and expenditure for a specific period. In educational institutions, it is a basic management tool for planning and control.",
                    "sections": [
                        {
                            "title": "Concept and Scope of Budget",
                            "paragraphs": [
                                "The concept of budget includes forecasting financial needs, allocating funds to different heads, and ensuring that resources are used according to institutional priorities. Its scope covers salaries, maintenance, learning materials, utilities, development work, and emergency needs.",
                            ],
                        },
                        {
                            "title": "Functions of Budget",
                            "bullets": [
                                "Planning financial activities in advance",
                                "Allocating resources according to priorities",
                                "Controlling expenditure and preventing waste",
                                "Supporting transparency and accountability",
                                "Providing a basis for review and future decision-making",
                            ],
                        },
                    ],
                    "conclusion": "The budget is both a planning and control instrument. Its concept extends across the entire financial life of the institution, and its functions help ensure efficient, transparent, and goal-oriented use of resources.",
                },
            },
            {
                "question": "What is a school record? Write why a school record is necessary for better results and discipline in a school.",
                "answer": {
                    "intro": "A school record is an official written account of important information related to students, staff, finance, attendance, examinations, property, and administration. It serves as the memory and evidence base of the institution.",
                    "sections": [
                        {
                            "title": "Need for School Record",
                            "bullets": [
                                "It helps monitor attendance, achievement, and conduct.",
                                "It supports administrative planning and decision-making.",
                                "It provides evidence for accountability and reporting.",
                                "It improves discipline by making rules and actions traceable.",
                                "It helps identify trends, problems, and student needs.",
                            ],
                            "paragraphs": [
                                "For better results, the school needs accurate records of student progress, examination performance, and teacher work. For discipline, records of attendance, behavior, counseling, and follow-up are very important.",
                            ],
                        },
                    ],
                    "conclusion": "School record is an essential institutional document system. It improves results by supporting planning and monitoring, and it strengthens discipline by providing continuity, evidence, and organized follow-up.",
                },
            },
            {
                "question": "Differentiate between the curriculum council of federal jurisdiction and provincial curriculum departments on their functions and roles.",
                "answer": {
                    "intro": "The curriculum council at federal level and provincial curriculum departments both play important roles, but their jurisdiction, scope, and operational focus are different.",
                    "sections": [
                        {
                            "title": "Federal Curriculum Council",
                            "paragraphs": [
                                "At the federal level, curriculum bodies are more concerned with broad national direction, standard setting, coordination, and policy-level curriculum guidance. Their role includes maintaining national coherence, ensuring alignment with educational priorities, and supporting common standards.",
                            ],
                        },
                        {
                            "title": "Provincial Curriculum Departments",
                            "paragraphs": [
                                "Provincial curriculum departments are more directly involved in adaptation, implementation support, contextualization, textbook processes, training coordination, and operational curriculum work within their provinces.",
                            ],
                        },
                        {
                            "title": "Difference in Roles",
                            "bullets": [
                                "Federal bodies provide national direction; provincial bodies operationalize curriculum in local contexts.",
                                "Federal jurisdiction is broader and standard-oriented; provincial departments are more implementation-oriented.",
                                "Provincial departments address local language, context, and execution issues more directly.",
                            ],
                        },
                    ],
                    "conclusion": "Federal and provincial curriculum bodies are complementary rather than identical. The federal level ensures coherence and direction, while provincial departments help translate curriculum into effective local implementation.",
                },
            },
            {
                "question": "Identify criteria for evaluation. Give suggestions for improvement of management through evaluation.",
                "answer": {
                    "intro": "Evaluation in management means judging the effectiveness of institutional work on the basis of clear criteria and evidence. It helps leaders know whether goals are being achieved efficiently and fairly.",
                    "sections": [
                        {
                            "title": "Criteria for Evaluation",
                            "bullets": [
                                "Achievement of goals and objectives",
                                "Efficiency in use of resources",
                                "Quality of leadership and supervision",
                                "Staff performance and cooperation",
                                "Student outcomes and institutional discipline",
                                "Transparency, communication, and accountability",
                            ],
                        },
                        {
                            "title": "Suggestions for Improvement Through Evaluation",
                            "numbers": [
                                "Use regular internal evaluation instead of waiting for external inspection only.",
                                "Collect evidence from records, observation, feedback, and results.",
                                "Involve staff in reflective review so evaluation becomes developmental.",
                                "Link evaluation findings with training and corrective planning.",
                                "Use evaluation to improve systems, not merely to blame individuals.",
                            ],
                        },
                    ],
                    "conclusion": "Evaluation is meaningful when it is based on clear criteria and used for improvement. Through regular, evidence-based, and participatory evaluation, educational management can become more efficient, transparent, and responsive.",
                },
            },
        ],
    },
    {
        "filename": "8606_Assignment_1.docx",
        "course_title": "Citizenship Education and Community Engagement",
        "course_code": "8606",
        "assignment_no": "1",
        "units": "Units 1-4",
        "level": "B.Ed",
        "refs": [
            "AIOU Spring 2026 assignment sheet for Course 8606.",
            "AIOU official related texts used for conceptual grounding: Introduction to Sociology: Culture & Society (Code 9410), Teacher Education in Pakistan (Code 8626), and other AIOU community-engagement-related material where the direct 8606 softbook was not publicly available at the standard softbook URL on July 24, 2026.",
        ],
        "questions": [
            {
                "question": "Describe your role as an individual in society. Elaborate on types of social structure.",
                "answer": {
                    "intro": "Every individual is both a product of society and a contributor to it. Society shapes our values, language, responsibilities, and identity, but at the same time individuals influence social life through behavior, participation, and service.",
                    "sections": [
                        {
                            "title": "Role of an Individual in Society",
                            "bullets": [
                                "To obey laws and respect social norms",
                                "To fulfill family, educational, and civic responsibilities",
                                "To contribute positively through work, honesty, and service",
                                "To respect others' rights and dignity",
                                "To promote peace, cooperation, and social harmony",
                            ],
                            "paragraphs": [
                                "As an individual, my role in society includes behaving responsibly, supporting community welfare, respecting diversity, and participating in constructive social activities. A good individual does not live only for personal interest; he or she recognizes the interdependence of social life.",
                            ],
                        },
                        {
                            "title": "Types of Social Structure",
                            "paragraphs": [
                                "Social structure refers to the organized pattern of social relationships, institutions, roles, and statuses that shape society. One type is family-based structure, where kinship and household relations are central.",
                                "Another type is class structure, in which society is organized according to economic position and access to resources.",
                                "Institutional structure is also important; here roles are organized around institutions such as school, religion, economy, and state.",
                                "Traditional and modern structures can also be compared. Traditional structures are usually more kinship-based and role-bound, while modern structures are more complex, formal, and specialized.",
                            ],
                        },
                    ],
                    "conclusion": "An individual's role in society is to act responsibly, ethically, and cooperatively. Social structure provides the organized framework in which this role is performed through family, class, institutions, and broader social arrangements.",
                },
            },
            {
                "question": "Explain any ten cultural elements of Pakistani culture with specific examples.",
                "answer": {
                    "intro": "Culture includes the beliefs, values, customs, language, symbols, and practices shared by a society. Pakistani culture is rich, diverse, and deeply influenced by religion, region, history, and family traditions.",
                    "sections": [
                        {
                            "title": "Ten Cultural Elements of Pakistani Culture",
                            "numbers": [
                                "Language: Urdu is the national language, while Punjabi, Sindhi, Pashto, Balochi, Saraiki, and others reflect regional identity.",
                                "Religion: Islamic beliefs shape festivals, daily practices, charity, and moral values.",
                                "Family system: Joint and extended family traditions remain influential in many areas.",
                                "Dress: Shalwar kameez is a widely recognized national dress, with regional styles adding variation.",
                                "Food: Biryani, saag, roti, karahi, haleem, and regional dishes represent local culinary traditions.",
                                "Festivals: Eid-ul-Fitr, Eid-ul-Azha, and national days create shared cultural experience.",
                                "Respect for elders: Greeting customs and decision-making patterns reflect this value strongly.",
                                "Hospitality: Guests are often treated warmly and generously, especially in family settings.",
                                "Marriage customs: Nikah, rukhsati, mehndi, and walima reflect social and cultural traditions.",
                                "Arts and crafts: Truck art, embroidery, ajrak, pottery, and folk music show cultural creativity.",
                            ],
                        },
                    ],
                    "conclusion": "Pakistani culture is made up of many interrelated elements, including language, religion, family values, customs, food, dress, and artistic traditions. These elements give the society its identity and continuity while also showing regional diversity.",
                },
            },
            {
                "question": "What are techniques for managing group dynamics? How do these techniques help in learning group behaviors? Give specific examples.",
                "answer": {
                    "intro": "Group dynamics refers to the patterns of interaction, influence, communication, and behavior that emerge when people work together. Managing group dynamics is important in classrooms and community settings because effective groups support learning, participation, and cooperation.",
                    "sections": [
                        {
                            "title": "Techniques for Managing Group Dynamics",
                            "bullets": [
                                "Clear goal setting",
                                "Role assignment within the group",
                                "Establishing group norms",
                                "Encouraging balanced participation",
                                "Conflict resolution and mediation",
                                "Feedback and reflection sessions",
                            ],
                            "paragraphs": [
                                "These techniques help members understand expectations and work together productively. For example, in a classroom project one student may be assigned as presenter, another as note taker, and another as timekeeper. This reduces confusion and improves responsibility.",
                            ],
                        },
                        {
                            "title": "How These Techniques Support Learning of Group Behavior",
                            "paragraphs": [
                                "When roles and norms are clear, students learn cooperation, patience, leadership, and respect for others' views. Conflict resolution techniques help them understand how disagreement can be handled constructively rather than emotionally.",
                                "Specific examples include group discussion tasks where each member must contribute one idea, or peer-learning activities where stronger students support weaker students while still respecting them.",
                            ],
                        },
                    ],
                    "conclusion": "Managing group dynamics through structure, roles, norms, and reflection helps learners develop healthy group behavior. It improves cooperation, communication, and social learning, which are all important for both citizenship and classroom success.",
                },
            },
            {
                "question": "Describe the role of school in socialization. Write the specific role teacher in socialization.",
                "answer": {
                    "intro": "Socialization is the process through which individuals learn norms, values, roles, and expected behavior in society. After the family, the school is one of the most important agencies of socialization.",
                    "sections": [
                        {
                            "title": "Role of School in Socialization",
                            "paragraphs": [
                                "The school introduces children to formal rules, collective life, cooperation, punctuality, discipline, and social responsibility. It also exposes them to diversity, teamwork, institutional roles, and shared civic values.",
                                "Through curriculum, routines, assembly, classroom interaction, and co-curricular activities, schools help shape attitudes toward work, authority, citizenship, and social coexistence.",
                            ],
                        },
                        {
                            "title": "Specific Role of Teacher in Socialization",
                            "bullets": [
                                "Acts as a role model in speech, fairness, and behavior",
                                "Teaches discipline, mutual respect, and cooperation",
                                "Encourages tolerance and positive interaction among students",
                                "Guides students in resolving conflicts constructively",
                                "Connects moral and civic values with daily practice",
                            ],
                            "paragraphs": [
                                "The teacher's role is especially important because students observe and imitate behavior. A teacher who is just, punctual, respectful, and cooperative teaches these qualities not only through instruction but also through personal example.",
                            ],
                        },
                    ],
                    "conclusion": "School is a major institution of socialization because it prepares learners for organized social life beyond the family. Within this process, the teacher plays a central role as guide, model, and moral influence.",
                },
            },
            {
                "question": "Highlight the significance of social institutions with relevant examples from your life.",
                "answer": {
                    "intro": "Social institutions are organized patterns of behavior and relationships developed to meet major social needs. They bring stability, direction, and order to society.",
                    "sections": [
                        {
                            "title": "Significance of Social Institutions",
                            "paragraphs": [
                                "Family is significant because it provides emotional support, early socialization, and moral guidance. Education is significant because it transmits knowledge, discipline, and social responsibility. Religion gives moral orientation and a sense of meaning. Economy helps people meet livelihood needs, while state institutions provide law and order and public administration.",
                                "In my own life, family has shaped my manners and values, school has expanded my thinking and discipline, and religious institutions have strengthened ethical awareness and community feeling.",
                            ],
                        },
                    ],
                    "conclusion": "Social institutions are significant because they organize social life and help individuals meet major needs in an orderly way. Through family, school, religion, economy, and state institutions, people learn values, roles, and responsibilities that support social continuity.",
                },
            },
        ],
    },
    {
        "filename": "8606_Assignment_2.docx",
        "course_title": "Citizenship Education and Community Engagement",
        "course_code": "8606",
        "assignment_no": "2",
        "units": "Units 5-9",
        "level": "B.Ed",
        "refs": [
            "AIOU Spring 2026 assignment sheet for Course 8606.",
            "AIOU official related texts used for conceptual grounding: Introduction to Sociology: Culture & Society (Code 9410), Teacher Education in Pakistan (Code 8626), and other AIOU community-engagement-related material where the direct 8606 softbook was not publicly available at the standard softbook URL on July 24, 2026.",
        ],
        "questions": [
            {
                "question": "For how long are the methods of social control mentioned in this book effective in our society?",
                "answer": {
                    "intro": "Methods of social control are effective only as long as they remain socially accepted, morally relevant, and institutionally supported. Social control refers to the means through which society regulates behavior and maintains order.",
                    "sections": [
                        {
                            "title": "Nature of Social Control",
                            "paragraphs": [
                                "Social control includes formal methods such as law, regulations, school discipline, and official sanctions, as well as informal methods such as family influence, community opinion, religion, custom, and peer pressure.",
                            ],
                        },
                        {
                            "title": "How Long They Remain Effective",
                            "paragraphs": [
                                "These methods remain effective as long as society continues to respect them and as long as they are applied fairly. If laws are ignored, customs lose moral strength, or institutions act unjustly, social control weakens.",
                                "In our society, many informal methods such as family influence and community pressure are still effective, but they are changing because urbanization, media, mobility, and technology are transforming social relationships.",
                            ],
                        },
                    ],
                    "conclusion": "Methods of social control remain effective only while they are trusted, relevant, and supported by social institutions. In modern society their form may change, but the need for social control continues as long as social life requires order and responsibility.",
                },
            },
            {
                "question": "Describe the role of teachers towards the success of students as citizens.",
                "answer": {
                    "intro": "Teachers contribute to citizenship not only by teaching lessons but by helping students become responsible, ethical, and socially aware members of society.",
                    "sections": [
                        {
                            "title": "Role of Teachers in Student Citizenship",
                            "bullets": [
                                "Teach respect for law, rights, and responsibilities",
                                "Promote honesty, cooperation, and tolerance",
                                "Encourage participation in school and community activities",
                                "Develop critical thinking and social awareness",
                                "Model democratic and respectful behavior in classroom life",
                            ],
                            "paragraphs": [
                                "A teacher supports successful citizenship by connecting education with real social responsibility. Students learn citizenship better when they experience fairness, participation, and accountability in their daily school environment.",
                            ],
                        },
                    ],
                    "conclusion": "Teachers play a major role in preparing students for citizenship through instruction, example, guidance, and participation opportunities. Their influence extends beyond academic success to civic and moral development.",
                },
            },
            {
                "question": "Compare the communication styles of two teachers in a school. You can use a checklist or interview as a tool to measure the communication skills of teachers.",
                "answer": {
                    "intro": "Communication style strongly affects classroom climate, student confidence, and learning quality. To compare two teachers, one may use a checklist, observation schedule, or interview tool.",
                    "sections": [
                        {
                            "title": "Illustrative Comparison",
                            "paragraphs": [
                                "Teacher A may use clear, respectful, and encouraging communication. Such a teacher explains instructions step by step, listens to students, uses positive feedback, and maintains eye contact. Students in such a class generally feel more confident and willing to participate.",
                                "Teacher B may communicate in a more authoritarian or unclear way, perhaps by speaking too fast, using harsh tone, or giving little opportunity for questions. In such a case students may hesitate to respond and learning interaction becomes weaker.",
                            ],
                        },
                        {
                            "title": "Checklist Indicators",
                            "bullets": [
                                "Clarity of speech and instructions",
                                "Use of respectful tone",
                                "Listening to student responses",
                                "Encouraging participation",
                                "Non-verbal communication such as eye contact and gestures",
                                "Feedback style and patience",
                            ],
                            "paragraphs": [
                                "Using such a checklist during classroom observation allows the researcher or evaluator to compare teachers systematically instead of relying only on personal impression.",
                            ],
                        },
                    ],
                    "conclusion": "Communication styles can vary greatly between teachers, and these differences shape student learning and confidence. A checklist or interview makes the comparison more systematic and helps identify strengths and areas for improvement.",
                },
            },
            {
                "question": "What are sources of technological change? Explain in detail.",
                "answer": {
                    "intro": "Technological change refers to the development and spread of new tools, systems, and methods that alter work, communication, learning, and social life. It is driven by multiple sources rather than a single cause.",
                    "sections": [
                        {
                            "title": "Sources of Technological Change",
                            "paragraphs": [
                                "Scientific research is a major source because new inventions often grow out of systematic experimentation and discovery. Industrial needs also drive technological change because businesses seek efficiency, productivity, and competitiveness.",
                                "Education and training contribute by producing skilled people who can design, adapt, and use new technologies. Communication networks and globalization spread technology rapidly across regions. Social needs, such as health, mobility, security, and learning access, also push societies toward technological innovation.",
                            ],
                            "bullets": [
                                "Scientific inquiry and invention",
                                "Industrial and economic demand",
                                "Educational and technical training systems",
                                "Global communication and media",
                                "Social and community needs",
                            ],
                        },
                    ],
                    "conclusion": "Technological change emerges from scientific, economic, educational, and social forces working together. Understanding these sources helps teachers and citizens respond thoughtfully to technological transformation rather than treating it as an isolated phenomenon.",
                },
            },
            {
                "question": "As a teacher, write the complete plan for a teacher-parents meeting. Also mention the objectives of the meeting.",
                "answer": {
                    "intro": "A teacher-parents meeting is an organized interaction between school and home to discuss student progress, behavior, support needs, and mutual cooperation. A well-planned meeting strengthens trust and improves educational outcomes.",
                    "sections": [
                        {
                            "title": "Objectives of the Meeting",
                            "bullets": [
                                "To share academic progress and classroom behavior of students",
                                "To discuss attendance, discipline, and learning difficulties",
                                "To build cooperation between parents and teachers",
                                "To suggest ways parents can support learning at home",
                                "To strengthen trust and communication between school and family",
                            ],
                        },
                        {
                            "title": "Complete Plan",
                            "numbers": [
                                "Decide the date, time, and venue well in advance.",
                                "Prepare invitations or notices for parents.",
                                "Set the agenda clearly, including progress discussion, issues, and suggestions.",
                                "Collect relevant student data such as attendance, marks, class behavior, and teacher observations.",
                                "Arrange seating and a welcoming environment.",
                                "Begin the meeting with purpose and respectful introduction.",
                                "Discuss each student's strengths, weaknesses, and support needs honestly but positively.",
                                "Allow parents to share their observations and concerns.",
                                "Agree on follow-up actions for home and school.",
                                "Record important points and thank parents for cooperation.",
                            ],
                        },
                    ],
                    "conclusion": "A teacher-parents meeting becomes effective when it is well planned, respectful, evidence-based, and solution-oriented. Its objectives should focus on student progress and stronger home-school partnership, while the plan should ensure clear communication and practical follow-up.",
                },
            },
        ],
    },
]


def main():
    for item in ASSIGNMENTS:
        save_assignment(
            item["filename"],
            item["course_title"],
            item["course_code"],
            item["assignment_no"],
            item["units"],
            item["level"],
            item["questions"],
            item["refs"],
        )
        print(f"Created {OUT_DIR / item['filename']}")


if __name__ == "__main__":
    main()
