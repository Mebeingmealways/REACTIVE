window.SLIDES=[
// ── 1: TITLE SLIDE ──
{ accent:'indigo', fragments:[
  {t:'badge',c:'Seminar Presentation · May 2026'},
  {t:'logo'},
  {t:'h1',c:'The Reactive Manifesto'},
  {t:'sub',c:'Why Modern Software Had to Stop Blocking, Start Reacting — and What That Actually Means in Production'},
  {t:'divider'},
  {t:'presenter',c:{name:'Aaryan Choudhary',roll:'Roll No. 23UCSE4002',dept:'Department of Computer Science & Engineering',univ:'MBM University, Jodhpur',note:'Submitted for the partial fulfilment of the requirements for the degree of Bachelor of Engineering in Computer Science & Engineering.'}},
  {t:'pills',c:['RESPONSIVE','RESILIENT','ELASTIC','MESSAGE-DRIVEN']},
]},

// ── 2: WHY A MANIFESTO ──
{ accent:'teal', fragments:[
  {t:'icon',c:'history'},
  {t:'h1',c:'Why Did the Industry Need a Manifesto?'},
  {t:'sub',c:'Between 2008 and 2013, user expectations exploded. Architectures designed for the pre-cloud era simply could not keep pace.'},
  {t:'cols',c:{
    l:{head:'Then · Pre-2010',cls:'muted',items:['Seconds of latency acceptable','Gigabytes of data, few servers','Weekly or monthly releases','Blocking, thread-per-request I/O','Vertical scaling (bigger box)','Planned downtime windows']},
    r:{head:'Now · Post-2013',cls:'accent',items:['Millisecond response expected','Petabytes, always-on clusters','Continuous delivery pipelines','Non-blocking, async by default','Horizontal scaling (more nodes)','Downtime = revenue lost instantly']}
  }},
  {t:'note',c:'Jonas Bonér, Dave Farley, Roland Kuhn & Martin Thompson published the Reactive Manifesto v2.0 at QCon 2014, giving the industry a shared vocabulary.'},
]},

// ── 3: FOUR TRAITS ──
{ accent:'purple', fragments:[
  {t:'icon',c:'architecture'},
  {t:'h1',c:'Four Traits. One Coherent Architecture.'},
  {t:'sub',c:'These aren\'t independent check-boxes — they form a self-reinforcing system where each trait enables the others.'},
  {t:'grid4',c:[
    {icon:'bolt',color:'#6366f1',head:'Responsive',text:'Provides rapid, consistent response times. Sets measurable latency bounds. The foundation of usability and trust.'},
    {icon:'shield',color:'#14b8a6',head:'Resilient',text:'Stays responsive under failure. Uses isolation, replication, and delegation so no single crash takes down the system.'},
    {icon:'expand',color:'#f59e0b',head:'Elastic',text:'Stays responsive under varying load. Scales out and in dynamically — no manual capacity planning.'},
    {icon:'mail',color:'#ec4899',head:'Message-Driven',text:'Components communicate via async messages. Enables loose coupling, isolation, location transparency, and back-pressure.'}
  ]},
  {t:'diamond',c:['⚡ Responsive','🛡️ Resilient','✉️ Message-Driven','📐 Elastic','REACTIVE<br>SYSTEM']},
]},

// ── 4: RESPONSIVE ──
{ accent:'blue', fragments:[
  {t:'badge',c:'Trait 01'},
  {t:'h1',c:'Responsive'},
  {t:'quote',c:'"The system responds in a timely manner if at all possible. Responsiveness is the cornerstone of usability."'},
  {t:'list',c:['Define hard latency SLOs — p95 < 100 ms, p99 < 250 ms','Use non-blocking I/O so no thread ever sits idle waiting','Apply back-pressure: slow producers when consumers are overwhelmed','Circuit breakers prevent one slow service from cascading delays','Graceful degradation is always better than silent hanging']},
  {t:'callout',c:{head:'Anti-Pattern: Silent Death',text:'A Spring WebFlux service appeared reactive but contained a single blocking JDBC call on the event loop. All threads stalled. No exception. No alert. Users experienced 30-second hangs.',fix:'Fix: Mono.fromCallable(() → jdbc()).subscribeOn(Schedulers.boundedElastic()) + migrate to R2DBC.'}},
  {t:'metrics',c:['p50 / p90 / p99 Latency','Throughput (req/s)','Error Rate Under Load','Event-Loop Utilization']},
]},

// ── 5: RESILIENT ──
{ accent:'teal', fragments:[
  {t:'badge',c:'Trait 02'},
  {t:'h1',c:'Resilient'},
  {t:'quote',c:'"Stays responsive in the face of failure. Achieved through replication, containment, isolation, and delegation."'},
  {t:'grid3',c:[
    {icon:'supervisor',color:'#8b5cf6',head:'Actor Supervision',text:'Each actor has a supervisor. On crash: restart, stop, or escalate. One failure is isolated. Nothing else dies. Core to Akka & Erlang/OTP.'},
    {icon:'bulkhead',color:'#06b6d4',head:'Bulkheads',text:'Partition into compartments with dedicated thread pools. One overloaded pool cannot starve another — borrowed from ship hull design.'},
    {icon:'breaker',color:'#f43f5e',head:'Circuit Breaker',text:'After N failures → open the circuit. Return fast errors instead of queuing. Prevents thread-exhaustion cascades across services.'}
  ]},
  {t:'tree',c:{root:'System Guardian',children:[{name:'Supervisor A',sup:true},{name:'Supervisor B',sup:true}],leaf:['Actor 1','Actor 2 ✗','Actor 3','Actor 4']}},
]},

// ── 6: ELASTIC & MESSAGE-DRIVEN ──
{ accent:'amber', fragments:[
  {t:'h1',c:'Elastic & Message-Driven'},
  {t:'split',c:{
    l:{icon:'expand',head:'Elastic',items:['Shard, replicate, partition — no single bottleneck','K8s HPA auto-scales on CPU or queue depth','Stateless services: add a node, it just works','Akka Cluster Sharding moves entities to available capacity','Scale IN too — idle nodes waste money'],anti:'Fixed cluster + single-writer DB = elastic in name only.'},
    r:{icon:'mail',head:'Message-Driven',items:['Actor model: private state + message inbox — no shared memory','Event Sourcing + CQRS: every mutation is a durable event','Kafka / RabbitMQ decouple producers from consumers in time & space','Reactive Streams: subscriber signals demand (back-pressure)','Trade-off: eventual consistency becomes the default model'],anti:'Shared DB table as a "queue". Unbounded buffers. Hidden sync in async flows.'}
  }},
  {t:'flow',c:[{box:'Producer',label:'generates events'},{box:'Kafka Bus',label:'async queue'},{box:'Stream Processor',label:'Akka Streams'},{box:'Actor',label:'business logic'},{box:'Consumer',label:'responds'}]},
]},

// ── 7: HEAD-TO-HEAD ──
{ accent:'indigo', fragments:[
  {t:'icon',c:'compare'},
  {t:'h1',c:'Reactive vs Traditional'},
  {t:'table',c:{
    hd:['Dimension','Reactive','Traditional'],
    rows:[
      ['Latency','Low & consistent even at p99','Spikes under contention; blocking inflates tail'],
      ['Throughput','High — event loops reuse threads','Capped by thread pool; idle threads waste CPU'],
      ['Scalability','Horizontal by design','Scale-up; monoliths hit sync bottlenecks'],
      ['Fault Tolerance','Supervision trees, bulkheads, breakers','Centralized — one failure can cascade'],
      ['Consistency','Eventual by default (AP)','Strong ACID easier, but costlier'],
      ['Complexity','Higher: async patterns, new discipline','Simpler mental model, mature tooling'],
      ['Cost','Better utilization → lower cloud bill','Over-provision for peak → waste']
    ]
  }},
]},

// ── 8: CASE STUDY — CAPITAL ONE ──
{ accent:'green', fragments:[
  {t:'badge',c:'Case Study 01'},
  {t:'h1',c:'Capital One — Real-Time Auto Financing'},
  {t:'stats',c:[{v:'5×',l:'Throughput gain'},{v:'486',l:'Loan apps / min'},{v:'180ms',l:'Response (was minutes)'},{v:'99.99%',l:'Uptime'}]},
  {t:'scale',c:[{i:1,v:'100',l:'Old'},{i:2,v:'200',l:'+Node'},{i:3,v:'340',l:'+Actor'},{i:4,v:'486',l:'+Kafka'},{i:5,v:'486',l:'Stable'}]},
  {t:'list',c:['Akka actors orchestrate business logic across loan-approval steps','Kafka event bus decouples credit checks, underwriting, and notifications','Docker + Kubernetes provides elastic horizontal scaling','Cassandra for distributed storage; Spark for real-time ML scoring','Akka Persistence gives a full event-sourced audit trail (regulatory requirement)']},
  {t:'highlight',c:'Old system: 100 apps/min on a clustered server. New system: 486/min on a single laptop during stress testing. Customers now pre-qualify instantly.'},
]},

// ── 9: CASE STUDY — AUTOTRACE ──
{ accent:'cyan', fragments:[
  {t:'badge',c:'Case Study 02'},
  {t:'h1',c:'AutoTrace Fleet Telematics — 10 M Events / Day'},
  {t:'sub',c:'OBD-II sensors on thousands of trucks stream GPS + engine telemetry 24/7. Fleet managers need real-time harsh-braking alerts, geo-fence events, and fault codes — in seconds, not overnight batches.'},
  {t:'list',c:['Scala + Akka Streams consume Kafka topics with built-in back-pressure','WebSocket push delivers alerts to the dashboard in under 2 seconds','Kafka log retention means a node crash causes zero data loss','Real-time driver scorecards improve safety and lower fleet insurance premiums']},
  {t:'highlight',c:'"We never think about scaling — it just scales." — AutoTrace Engineering Lead'},
]},

// ── 10: CASE STUDY — TEAM MOOD ──
{ accent:'purple', fragments:[
  {t:'badge',c:'Case Study 03'},
  {t:'h1',c:'Team Mood — 1 Developer. 20 K Users. Zero Crashes. 8 Years.'},
  {t:'stats',c:[{v:'1',l:'Developer'},{v:'20K',l:'Active users'},{v:'8 yr',l:'Zero crashes'},{v:'100%',l:'Uptime'}]},
  {t:'quote',c:'"Akka abstracts away so much backend complexity — a small team can focus entirely on product features instead of fighting concurrency bugs."'},
  {t:'list',c:['Akka actor model handles all concurrency — no thread locks ever written','Business logic actors run concurrently by default','Clear per-actor data ownership simplifies ISO 27001 privacy compliance','Stack: Akka (Scala) · LevelDB persistence · Single VM, cluster-ready if needed']},
  {t:'highlight',c:'Reactive isn\'t only for Netflix-scale. A solo developer ran a production SaaS for 8 years with zero downtime using the same principles.'},
]},
];
