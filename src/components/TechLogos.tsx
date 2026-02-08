// Tech Logos using Simple Icons - Verified icons only
import {
  // Cloud Providers & Platforms
  SiGooglecloud, SiFirebase, SiVercel, SiNetlify, SiHeroku, SiDigitalocean,
  SiCloudflare, SiFastly, SiAkamai, SiAlibabacloud, SiVultr,
  SiOvh, SiScaleway, SiHetzner, SiRailway, SiRender, SiFlydotio, SiUpstash,
  
  // Containers & Orchestration
  SiDocker, SiKubernetes, SiHelm, SiIstio, SiRancher, SiPortainer,
  SiContainerd, SiPodman,
  
  // Infrastructure as Code & Config
  SiTerraform, SiAnsible, SiPulumi, SiVagrant, SiPacker, SiSaltproject,
  SiChef, SiPuppet,
  
  // CI/CD & DevOps
  SiJenkins, SiGitlab, SiGithub, SiGithubactions, SiCircleci, SiTravisci, SiArgo,
  SiBitbucket, SiTeamcity, SiBamboo, SiDrone, SiCodeship,
  SiBuildkite, SiConcourse, SiSpinnaker, SiFlux,
  
  // Monitoring & Observability
  SiPrometheus, SiGrafana, SiDatadog, SiNewrelic, SiSplunk, SiElasticsearch,
  SiKibana, SiLogstash, SiSentry, SiPagerduty, SiDynatrace, SiJaeger,
  SiOpentelemetry, SiVictoriametrics, SiElasticstack,
  
  // Databases
  SiPostgresql, SiMysql, SiMariadb, SiSqlite, SiCockroachlabs,
  SiSinglestore, SiTimescale, SiVitess, SiTeradata,
  SiMongodb, SiRedis, SiNeo4j, SiCouchbase, SiApachecassandra, SiApachecouchdb,
  SiArangodb, SiScylladb, SiFauna, SiSurrealdb,
  SiSupabase, SiPlanetscale, SiAppwrite, SiTurso,
  
  // Data & Analytics
  SiSnowflake, SiDatabricks, SiClickhouse, SiApachedruid, SiApachehadoop,
  SiApachehive, SiApachespark, SiApacheflink, SiDbt, SiAirbyte, SiMetabase,
  
  // Message Queues
  SiApachekafka, SiRabbitmq, SiApachepulsar, SiApacherocketmq, SiNatsdotio,
  
  // Web Servers & Proxies
  SiNginx, SiApache, SiApachetomcat, SiCaddy, SiTraefikproxy, SiKong, SiEnvoyproxy,
  
  // Security & Auth
  SiVault, SiConsul, SiAuth0, SiOkta, SiClerk, SiKeycloak, Si1password,
  SiBitwarden, SiSnyk,
  
  // Programming Languages
  SiPython, SiJavascript, SiTypescript, SiGo, SiRust, SiKotlin, SiSwift,
  SiRuby, SiPhp, SiScala, SiElixir, SiHaskell, SiDart, SiClojure, SiErlang,
  SiOcaml, SiJulia, SiR, SiLua, SiZig, SiCplusplus, SiC, SiDotnet, SiSolidity,
  
  // Frontend Frameworks
  SiReact, SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs, SiNuxt, SiGatsby,
  SiFlutter, SiSolid, SiQwik, SiAstro, SiRemix, SiEmberdotjs, SiPreact,
  SiAlpinedotjs, SiHtmx, SiLit, SiStencil,
  
  // Backend Frameworks
  SiNodedotjs, SiDeno, SiBun, SiExpress, SiFastify, SiNestjs,
  SiDjango, SiFlask, SiSpring, SiLaravel, SiFastapi, SiRubyonrails,
  SiPhoenixframework, SiAdonisjs, SiKoa, SiHono, SiStrapi,
  SiDirectus, SiPayloadcms, SiMedusa,
  
  // Version Control
  SiGit, SiGitea, SiGitkraken, SiSourcetree,
  
  // Operating Systems
  SiLinux, SiUbuntu, SiDebian, SiRedhat, SiFedora, SiCentos, SiAlpinelinux,
  SiArchlinux, SiNixos, SiMacos, SiIos, SiAndroid,
  
  // IDEs & Editors
  SiIntellijidea, SiVim, SiNeovim, SiSublimetext, SiXcode, SiAndroidstudio,
  SiPycharm, SiWebstorm, SiGoland, SiDatagrip,
  
  // Collaboration
  SiSlack, SiDiscord, SiNotion, SiConfluence, SiJira, SiTrello, SiLinear,
  SiFigma, SiMiro, SiAsana, SiClickup, SiAirtable, SiObsidian, SiZoom,
  
  // Design & Creative
  SiSketch, SiInvision, SiCanva, SiBlender, SiUnity, SiUnrealengine, SiGodotengine,
  
  // Build Tools
  SiWebpack, SiVite, SiEsbuild, SiGulp, SiBabel, SiSwc, SiTurborepo, SiNx,
  SiPnpm, SiYarn, SiNpm,
  
  // Testing
  SiJest, SiCypress, SiStorybook, SiSelenium, SiPuppeteer,
  SiVitest, SiTestinglibrary, SiK6, SiGatling,
  
  // API & GraphQL
  SiGraphql, SiApollographql, SiPostman, SiInsomnia, SiSwagger, SiOpenapiinitiative,
  SiHasura, SiTrpc,
  
  // ORM & Database Tools
  SiPrisma, SiDrizzle, SiSequelize, SiTypeorm, SiMongoose, SiDbeaver,
  
  // CSS & Styling
  SiTailwindcss, SiBootstrap, SiMui, SiChakraui, SiAntdesign, SiRadixui,
  SiShadcnui, SiSass, SiPostcss, SiStyledcomponents,
  
  // AI & Machine Learning
  SiOpenai, SiTensorflow, SiPytorch, SiKeras, SiScikitlearn, SiPandas,
  SiNumpy, SiHuggingface, SiLangchain, SiOllama, SiGradio,
  SiStreamlit, SiMlflow, SiWeightsandbiases, SiJupyter, SiKaggle,
  SiPerplexity, SiClaude, SiAnthropic, SiMistralai,
  
  // Blockchain & Web3
  SiEthereum, SiBitcoin, SiPolkadot, SiSolana, SiPolygon, SiChainlink,
  SiIpfs, SiWeb3dotjs, SiAlchemy,
  
  // Payments & E-commerce
  SiStripe, SiPaypal, SiSquare, SiShopify, SiBigcommerce, SiWoocommerce, SiAdyen,
  
  // CMS
  SiWordpress, SiGhost, SiSanity, SiContentful, SiPrismic, SiStoryblok, SiDatocms,
  
  // Communication
  SiSendgrid, SiMailchimp, SiMailgun, SiTwilio, SiGooglemeet,
  
  // Google Cloud Services
  SiGoogleanalytics, SiGooglebigquery, SiGooglecloudstorage, SiGooglecloudspanner,
  SiGooglepubsub, SiGoogledataflow, SiGoogledataproc, SiGooglecolab,
  SiGooglemaps, SiGoogleappsscript, SiGooglebigtable,
  
  // Game Development
  SiSteam, SiEpicgames, SiPlaystation,
  
  // Low-code & Automation
  SiRetool, SiAppsmith, SiBudibase, SiWebflow, SiFramer, SiZapier, SiMake, SiN8n,
  
  // Mobile
  SiIonic, SiCapacitor, SiExpo,
} from '@icons-pack/react-simple-icons';

// Define tech logo categories with actual brand colors
export const techLogoCategories = [
  {
    name: 'Cloud Platforms',
    color: '#4285F4',
    logos: [
      { id: 'si-gcp', icon: SiGooglecloud, label: 'Google Cloud', color: '#4285F4' },
      { id: 'si-firebase', icon: SiFirebase, label: 'Firebase', color: '#FFCA28' },
      { id: 'si-vercel', icon: SiVercel, label: 'Vercel', color: '#000000' },
      { id: 'si-netlify', icon: SiNetlify, label: 'Netlify', color: '#00C7B7' },
      { id: 'si-heroku', icon: SiHeroku, label: 'Heroku', color: '#430098' },
      { id: 'si-digitalocean', icon: SiDigitalocean, label: 'DigitalOcean', color: '#0080FF' },
      { id: 'si-cloudflare', icon: SiCloudflare, label: 'Cloudflare', color: '#F38020' },
      { id: 'si-fastly', icon: SiFastly, label: 'Fastly', color: '#FF282D' },
      { id: 'si-akamai', icon: SiAkamai, label: 'Akamai', color: '#0096D6' },
      { id: 'si-alibabacloud', icon: SiAlibabacloud, label: 'Alibaba Cloud', color: '#FF6A00' },
      { id: 'si-vultr', icon: SiVultr, label: 'Vultr', color: '#007BFC' },
      { id: 'si-ovh', icon: SiOvh, label: 'OVH', color: '#123F6D' },
      { id: 'si-scaleway', icon: SiScaleway, label: 'Scaleway', color: '#4F0599' },
      { id: 'si-hetzner', icon: SiHetzner, label: 'Hetzner', color: '#D50C2D' },
      { id: 'si-railway', icon: SiRailway, label: 'Railway', color: '#0B0D0E' },
      { id: 'si-render', icon: SiRender, label: 'Render', color: '#46E3B7' },
      { id: 'si-fly', icon: SiFlydotio, label: 'Fly.io', color: '#7C3AED' },
      { id: 'si-upstash', icon: SiUpstash, label: 'Upstash', color: '#00E9A3' },
    ]
  },
  {
    name: 'Google Cloud Services',
    color: '#4285F4',
    logos: [
      { id: 'si-gcp2', icon: SiGooglecloud, label: 'Google Cloud', color: '#4285F4' },
      { id: 'si-bigquery', icon: SiGooglebigquery, label: 'BigQuery', color: '#669DF6' },
      { id: 'si-cloudstorage', icon: SiGooglecloudstorage, label: 'Cloud Storage', color: '#4285F4' },
      { id: 'si-spanner', icon: SiGooglecloudspanner, label: 'Cloud Spanner', color: '#4285F4' },
      { id: 'si-pubsub', icon: SiGooglepubsub, label: 'Pub/Sub', color: '#4285F4' },
      { id: 'si-dataflow', icon: SiGoogledataflow, label: 'Dataflow', color: '#4285F4' },
      { id: 'si-dataproc', icon: SiGoogledataproc, label: 'Dataproc', color: '#4285F4' },
      { id: 'si-colab', icon: SiGooglecolab, label: 'Colab', color: '#F9AB00' },
      { id: 'si-analytics', icon: SiGoogleanalytics, label: 'Analytics', color: '#E37400' },
      { id: 'si-googlemaps', icon: SiGooglemaps, label: 'Google Maps', color: '#4285F4' },
      { id: 'si-bigtable', icon: SiGooglebigtable, label: 'Bigtable', color: '#4285F4' },
    ]
  },
  {
    name: 'Containers & Orchestration',
    color: '#2496ED',
    logos: [
      { id: 'si-docker', icon: SiDocker, label: 'Docker', color: '#2496ED' },
      { id: 'si-kubernetes', icon: SiKubernetes, label: 'Kubernetes', color: '#326CE5' },
      { id: 'si-helm', icon: SiHelm, label: 'Helm', color: '#0F1689' },
      { id: 'si-istio', icon: SiIstio, label: 'Istio', color: '#466BB0' },
      { id: 'si-rancher', icon: SiRancher, label: 'Rancher', color: '#0075A8' },
      { id: 'si-portainer', icon: SiPortainer, label: 'Portainer', color: '#13BEF9' },
      { id: 'si-containerd', icon: SiContainerd, label: 'containerd', color: '#575757' },
      { id: 'si-podman', icon: SiPodman, label: 'Podman', color: '#892CA0' },
    ]
  },
  {
    name: 'Infrastructure as Code',
    color: '#7B42BC',
    logos: [
      { id: 'si-terraform', icon: SiTerraform, label: 'Terraform', color: '#7B42BC' },
      { id: 'si-ansible', icon: SiAnsible, label: 'Ansible', color: '#EE0000' },
      { id: 'si-pulumi', icon: SiPulumi, label: 'Pulumi', color: '#8A3391' },
      { id: 'si-vagrant', icon: SiVagrant, label: 'Vagrant', color: '#1868F2' },
      { id: 'si-packer', icon: SiPacker, label: 'Packer', color: '#02A8EF' },
      { id: 'si-saltstack', icon: SiSaltproject, label: 'Salt', color: '#57BCAD' },
      { id: 'si-chef', icon: SiChef, label: 'Chef', color: '#F09820' },
      { id: 'si-puppet', icon: SiPuppet, label: 'Puppet', color: '#FFAE1A' },
    ]
  },
  {
    name: 'CI/CD & DevOps',
    color: '#FC6D26',
    logos: [
      { id: 'si-jenkins', icon: SiJenkins, label: 'Jenkins', color: '#D24939' },
      { id: 'si-gitlab', icon: SiGitlab, label: 'GitLab', color: '#FC6D26' },
      { id: 'si-github', icon: SiGithub, label: 'GitHub', color: '#181717' },
      { id: 'si-githubactions', icon: SiGithubactions, label: 'GitHub Actions', color: '#2088FF' },
      { id: 'si-circleci', icon: SiCircleci, label: 'CircleCI', color: '#343434' },
      { id: 'si-travisci', icon: SiTravisci, label: 'Travis CI', color: '#3EAAAF' },
      { id: 'si-argo', icon: SiArgo, label: 'ArgoCD', color: '#EF7B4D' },
      { id: 'si-bitbucket', icon: SiBitbucket, label: 'Bitbucket', color: '#0052CC' },
      { id: 'si-teamcity', icon: SiTeamcity, label: 'TeamCity', color: '#000000' },
      { id: 'si-bamboo', icon: SiBamboo, label: 'Bamboo', color: '#0052CC' },
      { id: 'si-drone', icon: SiDrone, label: 'Drone', color: '#212121' },
      { id: 'si-buildkite', icon: SiBuildkite, label: 'Buildkite', color: '#14CC80' },
      { id: 'si-concourse', icon: SiConcourse, label: 'Concourse', color: '#3398DC' },
      { id: 'si-spinnaker', icon: SiSpinnaker, label: 'Spinnaker', color: '#139BB4' },
      { id: 'si-flux', icon: SiFlux, label: 'Flux', color: '#5468FF' },
    ]
  },
  {
    name: 'Monitoring & Observability',
    color: '#E6522C',
    logos: [
      { id: 'si-prometheus', icon: SiPrometheus, label: 'Prometheus', color: '#E6522C' },
      { id: 'si-grafana', icon: SiGrafana, label: 'Grafana', color: '#F46800' },
      { id: 'si-datadog', icon: SiDatadog, label: 'Datadog', color: '#632CA6' },
      { id: 'si-newrelic', icon: SiNewrelic, label: 'New Relic', color: '#1CE783' },
      { id: 'si-splunk', icon: SiSplunk, label: 'Splunk', color: '#000000' },
      { id: 'si-elasticsearch', icon: SiElasticsearch, label: 'Elasticsearch', color: '#005571' },
      { id: 'si-kibana', icon: SiKibana, label: 'Kibana', color: '#005571' },
      { id: 'si-logstash', icon: SiLogstash, label: 'Logstash', color: '#005571' },
      { id: 'si-sentry', icon: SiSentry, label: 'Sentry', color: '#362D59' },
      { id: 'si-pagerduty', icon: SiPagerduty, label: 'PagerDuty', color: '#06AC38' },
      { id: 'si-dynatrace', icon: SiDynatrace, label: 'Dynatrace', color: '#1496FF' },
      { id: 'si-jaeger', icon: SiJaeger, label: 'Jaeger', color: '#60D0E4' },
      { id: 'si-opentelemetry', icon: SiOpentelemetry, label: 'OpenTelemetry', color: '#425CC7' },
    ]
  },
  {
    name: 'SQL Databases',
    color: '#336791',
    logos: [
      { id: 'si-postgresql', icon: SiPostgresql, label: 'PostgreSQL', color: '#4169E1' },
      { id: 'si-mysql', icon: SiMysql, label: 'MySQL', color: '#4479A1' },
      { id: 'si-mariadb', icon: SiMariadb, label: 'MariaDB', color: '#003545' },
      { id: 'si-sqlite', icon: SiSqlite, label: 'SQLite', color: '#003B57' },
      { id: 'si-cockroach', icon: SiCockroachlabs, label: 'CockroachDB', color: '#6933FF' },
      { id: 'si-singlestore', icon: SiSinglestore, label: 'SingleStore', color: '#AA00FF' },
      { id: 'si-timescale', icon: SiTimescale, label: 'TimescaleDB', color: '#FDB515' },
    ]
  },
  {
    name: 'NoSQL Databases',
    color: '#47A248',
    logos: [
      { id: 'si-mongodb', icon: SiMongodb, label: 'MongoDB', color: '#47A248' },
      { id: 'si-redis', icon: SiRedis, label: 'Redis', color: '#DC382D' },
      { id: 'si-neo4j', icon: SiNeo4j, label: 'Neo4j', color: '#4581C3' },
      { id: 'si-couchbase', icon: SiCouchbase, label: 'Couchbase', color: '#EA2328' },
      { id: 'si-cassandra', icon: SiApachecassandra, label: 'Cassandra', color: '#1287B1' },
      { id: 'si-couchdb', icon: SiApachecouchdb, label: 'CouchDB', color: '#E42528' },
      { id: 'si-arangodb', icon: SiArangodb, label: 'ArangoDB', color: '#DDE072' },
      { id: 'si-scylladb', icon: SiScylladb, label: 'ScyllaDB', color: '#6CD5E7' },
      { id: 'si-fauna', icon: SiFauna, label: 'Fauna', color: '#3A1AB6' },
      { id: 'si-surrealdb', icon: SiSurrealdb, label: 'SurrealDB', color: '#FF00A0' },
    ]
  },
  {
    name: 'Cloud Databases',
    color: '#3ECF8E',
    logos: [
      { id: 'si-supabase', icon: SiSupabase, label: 'Supabase', color: '#3ECF8E' },
      { id: 'si-planetscale', icon: SiPlanetscale, label: 'PlanetScale', color: '#000000' },
      { id: 'si-appwrite', icon: SiAppwrite, label: 'Appwrite', color: '#FD366E' },
      { id: 'si-turso', icon: SiTurso, label: 'Turso', color: '#4FF8D2' },
    ]
  },
  {
    name: 'Data & Analytics',
    color: '#FF6F00',
    logos: [
      { id: 'si-snowflake', icon: SiSnowflake, label: 'Snowflake', color: '#29B5E8' },
      { id: 'si-databricks', icon: SiDatabricks, label: 'Databricks', color: '#FF3621' },
      { id: 'si-clickhouse', icon: SiClickhouse, label: 'ClickHouse', color: '#FFCC01' },
      { id: 'si-druid', icon: SiApachedruid, label: 'Apache Druid', color: '#29F1FB' },
      { id: 'si-hadoop', icon: SiApachehadoop, label: 'Hadoop', color: '#66CCFF' },
      { id: 'si-hive', icon: SiApachehive, label: 'Hive', color: '#FDEE21' },
      { id: 'si-spark', icon: SiApachespark, label: 'Apache Spark', color: '#E25A1C' },
      { id: 'si-flink', icon: SiApacheflink, label: 'Apache Flink', color: '#E6526F' },
      { id: 'si-dbt', icon: SiDbt, label: 'dbt', color: '#FF694B' },
      { id: 'si-airbyte', icon: SiAirbyte, label: 'Airbyte', color: '#615EFF' },
      { id: 'si-metabase', icon: SiMetabase, label: 'Metabase', color: '#509EE3' },
    ]
  },
  {
    name: 'Message Queues',
    color: '#FF6600',
    logos: [
      { id: 'si-kafka', icon: SiApachekafka, label: 'Kafka', color: '#231F20' },
      { id: 'si-rabbitmq', icon: SiRabbitmq, label: 'RabbitMQ', color: '#FF6600' },
      { id: 'si-pulsar', icon: SiApachepulsar, label: 'Apache Pulsar', color: '#188FFF' },
      { id: 'si-rocketmq', icon: SiApacherocketmq, label: 'RocketMQ', color: '#D77310' },
      { id: 'si-nats', icon: SiNatsdotio, label: 'NATS', color: '#27AAE1' },
    ]
  },
  {
    name: 'Web Servers & Proxies',
    color: '#009639',
    logos: [
      { id: 'si-nginx', icon: SiNginx, label: 'NGINX', color: '#009639' },
      { id: 'si-apache', icon: SiApache, label: 'Apache', color: '#D22128' },
      { id: 'si-tomcat', icon: SiApachetomcat, label: 'Tomcat', color: '#F8DC75' },
      { id: 'si-caddy', icon: SiCaddy, label: 'Caddy', color: '#1F88C0' },
      { id: 'si-traefik', icon: SiTraefikproxy, label: 'Traefik', color: '#24A1C1' },
      { id: 'si-kong', icon: SiKong, label: 'Kong', color: '#003459' },
      { id: 'si-envoy', icon: SiEnvoyproxy, label: 'Envoy', color: '#AC6199' },
    ]
  },
  {
    name: 'Security & Auth',
    color: '#000000',
    logos: [
      { id: 'si-vault', icon: SiVault, label: 'Vault', color: '#FFEC6E' },
      { id: 'si-consul', icon: SiConsul, label: 'Consul', color: '#F24C53' },
      { id: 'si-auth0', icon: SiAuth0, label: 'Auth0', color: '#EB5424' },
      { id: 'si-okta', icon: SiOkta, label: 'Okta', color: '#007DC1' },
      { id: 'si-clerk', icon: SiClerk, label: 'Clerk', color: '#6C47FF' },
      { id: 'si-keycloak', icon: SiKeycloak, label: 'Keycloak', color: '#4D4D4D' },
      { id: 'si-1password', icon: Si1password, label: '1Password', color: '#0094F5' },
      { id: 'si-bitwarden', icon: SiBitwarden, label: 'Bitwarden', color: '#175DDC' },
      { id: 'si-snyk', icon: SiSnyk, label: 'Snyk', color: '#4C4A73' },
    ]
  },
  {
    name: 'Programming Languages',
    color: '#3776AB',
    logos: [
      { id: 'si-python', icon: SiPython, label: 'Python', color: '#3776AB' },
      { id: 'si-javascript', icon: SiJavascript, label: 'JavaScript', color: '#F7DF1E' },
      { id: 'si-typescript', icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
      { id: 'si-dotnet', icon: SiDotnet, label: '.NET', color: '#512BD4' },
      { id: 'si-cplusplus', icon: SiCplusplus, label: 'C++', color: '#00599C' },
      { id: 'si-c', icon: SiC, label: 'C', color: '#A8B9CC' },
      { id: 'si-go', icon: SiGo, label: 'Go', color: '#00ADD8' },
      { id: 'si-rust', icon: SiRust, label: 'Rust', color: '#000000' },
      { id: 'si-kotlin', icon: SiKotlin, label: 'Kotlin', color: '#7F52FF' },
      { id: 'si-swift', icon: SiSwift, label: 'Swift', color: '#F05138' },
      { id: 'si-ruby', icon: SiRuby, label: 'Ruby', color: '#CC342D' },
      { id: 'si-php', icon: SiPhp, label: 'PHP', color: '#777BB4' },
      { id: 'si-scala', icon: SiScala, label: 'Scala', color: '#DC322F' },
      { id: 'si-elixir', icon: SiElixir, label: 'Elixir', color: '#4B275F' },
      { id: 'si-haskell', icon: SiHaskell, label: 'Haskell', color: '#5D4F85' },
      { id: 'si-dart', icon: SiDart, label: 'Dart', color: '#0175C2' },
      { id: 'si-clojure', icon: SiClojure, label: 'Clojure', color: '#5881D8' },
      { id: 'si-julia', icon: SiJulia, label: 'Julia', color: '#9558B2' },
      { id: 'si-r', icon: SiR, label: 'R', color: '#276DC3' },
      { id: 'si-lua', icon: SiLua, label: 'Lua', color: '#2C2D72' },
      { id: 'si-solidity', icon: SiSolidity, label: 'Solidity', color: '#363636' },
    ]
  },
  {
    name: 'Frontend Frameworks',
    color: '#61DAFB',
    logos: [
      { id: 'si-react', icon: SiReact, label: 'React', color: '#61DAFB' },
      { id: 'si-vue', icon: SiVuedotjs, label: 'Vue.js', color: '#4FC08D' },
      { id: 'si-angular', icon: SiAngular, label: 'Angular', color: '#DD0031' },
      { id: 'si-svelte', icon: SiSvelte, label: 'Svelte', color: '#FF3E00' },
      { id: 'si-nextjs', icon: SiNextdotjs, label: 'Next.js', color: '#000000' },
      { id: 'si-nuxt', icon: SiNuxt, label: 'Nuxt', color: '#00DC82' },
      { id: 'si-gatsby', icon: SiGatsby, label: 'Gatsby', color: '#663399' },
      { id: 'si-astro', icon: SiAstro, label: 'Astro', color: '#BC52EE' },
      { id: 'si-remix', icon: SiRemix, label: 'Remix', color: '#000000' },
      { id: 'si-solid', icon: SiSolid, label: 'Solid', color: '#2C4F7C' },
      { id: 'si-qwik', icon: SiQwik, label: 'Qwik', color: '#AC7EF4' },
      { id: 'si-preact', icon: SiPreact, label: 'Preact', color: '#673AB8' },
      { id: 'si-alpine', icon: SiAlpinedotjs, label: 'Alpine.js', color: '#8BC0D0' },
      { id: 'si-htmx', icon: SiHtmx, label: 'htmx', color: '#3366CC' },
      { id: 'si-ember', icon: SiEmberdotjs, label: 'Ember.js', color: '#E04E39' },
      { id: 'si-lit', icon: SiLit, label: 'Lit', color: '#324FFF' },
    ]
  },
  {
    name: 'Backend Frameworks',
    color: '#68A063',
    logos: [
      { id: 'si-nodejs', icon: SiNodedotjs, label: 'Node.js', color: '#339933' },
      { id: 'si-deno', icon: SiDeno, label: 'Deno', color: '#70FFAF' },
      { id: 'si-bun', icon: SiBun, label: 'Bun', color: '#000000' },
      { id: 'si-express', icon: SiExpress, label: 'Express', color: '#000000' },
      { id: 'si-fastify', icon: SiFastify, label: 'Fastify', color: '#000000' },
      { id: 'si-nestjs', icon: SiNestjs, label: 'NestJS', color: '#E0234E' },
      { id: 'si-django', icon: SiDjango, label: 'Django', color: '#092E20' },
      { id: 'si-flask', icon: SiFlask, label: 'Flask', color: '#000000' },
      { id: 'si-fastapi', icon: SiFastapi, label: 'FastAPI', color: '#009688' },
      { id: 'si-spring', icon: SiSpring, label: 'Spring', color: '#6DB33F' },
      { id: 'si-laravel', icon: SiLaravel, label: 'Laravel', color: '#FF2D20' },
      { id: 'si-rails', icon: SiRubyonrails, label: 'Ruby on Rails', color: '#CC0000' },
      { id: 'si-phoenix', icon: SiPhoenixframework, label: 'Phoenix', color: '#FD4F00' },
      { id: 'si-strapi', icon: SiStrapi, label: 'Strapi', color: '#4945FF' },
    ]
  },
  {
    name: 'Mobile Development',
    color: '#02569B',
    logos: [
      { id: 'si-flutter', icon: SiFlutter, label: 'Flutter', color: '#02569B' },
      { id: 'si-reactnative', icon: SiReact, label: 'React Native', color: '#61DAFB' },
      { id: 'si-ionic', icon: SiIonic, label: 'Ionic', color: '#3880FF' },
      { id: 'si-capacitor', icon: SiCapacitor, label: 'Capacitor', color: '#119EFF' },
      { id: 'si-expo', icon: SiExpo, label: 'Expo', color: '#000020' },
      { id: 'si-android', icon: SiAndroid, label: 'Android', color: '#3DDC84' },
      { id: 'si-ios', icon: SiIos, label: 'iOS', color: '#000000' },
    ]
  },
  {
    name: 'Version Control',
    color: '#F05032',
    logos: [
      { id: 'si-git', icon: SiGit, label: 'Git', color: '#F05032' },
      { id: 'si-github2', icon: SiGithub, label: 'GitHub', color: '#181717' },
      { id: 'si-gitlab2', icon: SiGitlab, label: 'GitLab', color: '#FC6D26' },
      { id: 'si-bitbucket2', icon: SiBitbucket, label: 'Bitbucket', color: '#0052CC' },
      { id: 'si-gitea', icon: SiGitea, label: 'Gitea', color: '#609926' },
      { id: 'si-gitkraken', icon: SiGitkraken, label: 'GitKraken', color: '#179287' },
      { id: 'si-sourcetree', icon: SiSourcetree, label: 'Sourcetree', color: '#0052CC' },
    ]
  },
  {
    name: 'Operating Systems',
    color: '#FCC624',
    logos: [
      { id: 'si-linux', icon: SiLinux, label: 'Linux', color: '#FCC624' },
      { id: 'si-ubuntu', icon: SiUbuntu, label: 'Ubuntu', color: '#E95420' },
      { id: 'si-debian', icon: SiDebian, label: 'Debian', color: '#A81D33' },
      { id: 'si-redhat', icon: SiRedhat, label: 'Red Hat', color: '#EE0000' },
      { id: 'si-fedora', icon: SiFedora, label: 'Fedora', color: '#51A2DA' },
      { id: 'si-centos', icon: SiCentos, label: 'CentOS', color: '#262577' },
      { id: 'si-alpine', icon: SiAlpinelinux, label: 'Alpine Linux', color: '#0D597F' },
      { id: 'si-arch', icon: SiArchlinux, label: 'Arch Linux', color: '#1793D1' },
      { id: 'si-nixos', icon: SiNixos, label: 'NixOS', color: '#5277C3' },
      { id: 'si-macos', icon: SiMacos, label: 'macOS', color: '#000000' },
    ]
  },
  {
    name: 'IDEs & Editors',
    color: '#007ACC',
    logos: [
      { id: 'si-intellij', icon: SiIntellijidea, label: 'IntelliJ', color: '#000000' },
      { id: 'si-vim', icon: SiVim, label: 'Vim', color: '#019733' },
      { id: 'si-neovim', icon: SiNeovim, label: 'Neovim', color: '#57A143' },
      { id: 'si-sublime', icon: SiSublimetext, label: 'Sublime Text', color: '#FF9800' },
      { id: 'si-xcode', icon: SiXcode, label: 'Xcode', color: '#147EFB' },
      { id: 'si-androidstudio', icon: SiAndroidstudio, label: 'Android Studio', color: '#3DDC84' },
      { id: 'si-pycharm', icon: SiPycharm, label: 'PyCharm', color: '#000000' },
      { id: 'si-webstorm', icon: SiWebstorm, label: 'WebStorm', color: '#000000' },
    ]
  },
  {
    name: 'Collaboration',
    color: '#4A154B',
    logos: [
      { id: 'si-slack', icon: SiSlack, label: 'Slack', color: '#4A154B' },
      { id: 'si-discord', icon: SiDiscord, label: 'Discord', color: '#5865F2' },
      { id: 'si-notion', icon: SiNotion, label: 'Notion', color: '#000000' },
      { id: 'si-confluence', icon: SiConfluence, label: 'Confluence', color: '#172B4D' },
      { id: 'si-jira', icon: SiJira, label: 'Jira', color: '#0052CC' },
      { id: 'si-trello', icon: SiTrello, label: 'Trello', color: '#0052CC' },
      { id: 'si-linear', icon: SiLinear, label: 'Linear', color: '#5E6AD2' },
      { id: 'si-figma', icon: SiFigma, label: 'Figma', color: '#F24E1E' },
      { id: 'si-miro', icon: SiMiro, label: 'Miro', color: '#050038' },
      { id: 'si-asana', icon: SiAsana, label: 'Asana', color: '#F06A6A' },
      { id: 'si-clickup', icon: SiClickup, label: 'ClickUp', color: '#7B68EE' },
      { id: 'si-airtable', icon: SiAirtable, label: 'Airtable', color: '#18BFFF' },
      { id: 'si-zoom', icon: SiZoom, label: 'Zoom', color: '#2D8CFF' },
    ]
  },
  {
    name: 'Build Tools',
    color: '#8DD6F9',
    logos: [
      { id: 'si-webpack', icon: SiWebpack, label: 'Webpack', color: '#8DD6F9' },
      { id: 'si-vite', icon: SiVite, label: 'Vite', color: '#646CFF' },
      { id: 'si-esbuild', icon: SiEsbuild, label: 'esbuild', color: '#FFCF00' },
      { id: 'si-gulp', icon: SiGulp, label: 'Gulp', color: '#CF4647' },
      { id: 'si-babel', icon: SiBabel, label: 'Babel', color: '#F9DC3E' },
      { id: 'si-swc', icon: SiSwc, label: 'SWC', color: '#000000' },
      { id: 'si-turborepo', icon: SiTurborepo, label: 'Turborepo', color: '#EF4444' },
      { id: 'si-nx', icon: SiNx, label: 'Nx', color: '#143055' },
      { id: 'si-pnpm', icon: SiPnpm, label: 'pnpm', color: '#F69220' },
      { id: 'si-yarn', icon: SiYarn, label: 'Yarn', color: '#2C8EBB' },
      { id: 'si-npm', icon: SiNpm, label: 'npm', color: '#CB3837' },
    ]
  },
  {
    name: 'Testing',
    color: '#99425B',
    logos: [
      { id: 'si-jest', icon: SiJest, label: 'Jest', color: '#C21325' },
      { id: 'si-cypress', icon: SiCypress, label: 'Cypress', color: '#17202C' },
      { id: 'si-storybook', icon: SiStorybook, label: 'Storybook', color: '#FF4785' },
      { id: 'si-selenium', icon: SiSelenium, label: 'Selenium', color: '#43B02A' },
      { id: 'si-puppeteer', icon: SiPuppeteer, label: 'Puppeteer', color: '#40B5A4' },
      { id: 'si-vitest', icon: SiVitest, label: 'Vitest', color: '#6E9F18' },
      { id: 'si-testinglibrary', icon: SiTestinglibrary, label: 'Testing Library', color: '#E33332' },
    ]
  },
  {
    name: 'API & GraphQL',
    color: '#E10098',
    logos: [
      { id: 'si-graphql', icon: SiGraphql, label: 'GraphQL', color: '#E10098' },
      { id: 'si-apollo', icon: SiApollographql, label: 'Apollo', color: '#311C87' },
      { id: 'si-postman', icon: SiPostman, label: 'Postman', color: '#FF6C37' },
      { id: 'si-insomnia', icon: SiInsomnia, label: 'Insomnia', color: '#4000BF' },
      { id: 'si-swagger', icon: SiSwagger, label: 'Swagger', color: '#85EA2D' },
      { id: 'si-openapi', icon: SiOpenapiinitiative, label: 'OpenAPI', color: '#6BA539' },
      { id: 'si-hasura', icon: SiHasura, label: 'Hasura', color: '#1EB4D4' },
      { id: 'si-trpc', icon: SiTrpc, label: 'tRPC', color: '#2596BE' },
    ]
  },
  {
    name: 'ORM & Database Tools',
    color: '#2D3748',
    logos: [
      { id: 'si-prisma', icon: SiPrisma, label: 'Prisma', color: '#2D3748' },
      { id: 'si-drizzle', icon: SiDrizzle, label: 'Drizzle', color: '#C5F74F' },
      { id: 'si-sequelize', icon: SiSequelize, label: 'Sequelize', color: '#52B0E7' },
      { id: 'si-typeorm', icon: SiTypeorm, label: 'TypeORM', color: '#FE0803' },
      { id: 'si-mongoose', icon: SiMongoose, label: 'Mongoose', color: '#880000' },
      { id: 'si-dbeaver', icon: SiDbeaver, label: 'DBeaver', color: '#382923' },
    ]
  },
  {
    name: 'CSS & Styling',
    color: '#06B6D4',
    logos: [
      { id: 'si-tailwind', icon: SiTailwindcss, label: 'Tailwind CSS', color: '#06B6D4' },
      { id: 'si-bootstrap', icon: SiBootstrap, label: 'Bootstrap', color: '#7952B3' },
      { id: 'si-mui', icon: SiMui, label: 'Material UI', color: '#007FFF' },
      { id: 'si-chakra', icon: SiChakraui, label: 'Chakra UI', color: '#319795' },
      { id: 'si-antdesign', icon: SiAntdesign, label: 'Ant Design', color: '#0170FE' },
      { id: 'si-radix', icon: SiRadixui, label: 'Radix UI', color: '#161618' },
      { id: 'si-shadcn', icon: SiShadcnui, label: 'shadcn/ui', color: '#000000' },
      { id: 'si-sass', icon: SiSass, label: 'Sass', color: '#CC6699' },
      { id: 'si-postcss', icon: SiPostcss, label: 'PostCSS', color: '#DD3A0A' },
      { id: 'si-styledcomponents', icon: SiStyledcomponents, label: 'styled-components', color: '#DB7093' },
    ]
  },
  {
    name: 'AI & Machine Learning',
    color: '#412991',
    logos: [
      { id: 'si-openai', icon: SiOpenai, label: 'OpenAI', color: '#412991' },
      { id: 'si-anthropic', icon: SiAnthropic, label: 'Anthropic', color: '#191919' },
      { id: 'si-claude', icon: SiClaude, label: 'Claude', color: '#CC785C' },
      { id: 'si-huggingface', icon: SiHuggingface, label: 'Hugging Face', color: '#FFD21E' },
      { id: 'si-tensorflow', icon: SiTensorflow, label: 'TensorFlow', color: '#FF6F00' },
      { id: 'si-pytorch', icon: SiPytorch, label: 'PyTorch', color: '#EE4C2C' },
      { id: 'si-keras', icon: SiKeras, label: 'Keras', color: '#D00000' },
      { id: 'si-scikitlearn', icon: SiScikitlearn, label: 'scikit-learn', color: '#F7931E' },
      { id: 'si-pandas', icon: SiPandas, label: 'Pandas', color: '#150458' },
      { id: 'si-numpy', icon: SiNumpy, label: 'NumPy', color: '#013243' },
      { id: 'si-langchain', icon: SiLangchain, label: 'LangChain', color: '#1C3C3C' },
      { id: 'si-ollama', icon: SiOllama, label: 'Ollama', color: '#000000' },
      { id: 'si-streamlit', icon: SiStreamlit, label: 'Streamlit', color: '#FF4B4B' },
      { id: 'si-jupyter', icon: SiJupyter, label: 'Jupyter', color: '#F37626' },
      { id: 'si-kaggle', icon: SiKaggle, label: 'Kaggle', color: '#20BEFF' },
    ]
  },
  {
    name: 'Blockchain & Web3',
    color: '#3C3C3D',
    logos: [
      { id: 'si-ethereum', icon: SiEthereum, label: 'Ethereum', color: '#3C3C3D' },
      { id: 'si-bitcoin', icon: SiBitcoin, label: 'Bitcoin', color: '#F7931A' },
      { id: 'si-solana', icon: SiSolana, label: 'Solana', color: '#9945FF' },
      { id: 'si-polygon', icon: SiPolygon, label: 'Polygon', color: '#8247E5' },
      { id: 'si-polkadot', icon: SiPolkadot, label: 'Polkadot', color: '#E6007A' },
      { id: 'si-chainlink', icon: SiChainlink, label: 'Chainlink', color: '#375BD2' },
      { id: 'si-ipfs', icon: SiIpfs, label: 'IPFS', color: '#65C2CB' },
      { id: 'si-web3', icon: SiWeb3dotjs, label: 'Web3.js', color: '#F16822' },
    ]
  },
  {
    name: 'Payments & E-commerce',
    color: '#635BFF',
    logos: [
      { id: 'si-stripe', icon: SiStripe, label: 'Stripe', color: '#635BFF' },
      { id: 'si-paypal', icon: SiPaypal, label: 'PayPal', color: '#00457C' },
      { id: 'si-square', icon: SiSquare, label: 'Square', color: '#006AFF' },
      { id: 'si-shopify', icon: SiShopify, label: 'Shopify', color: '#7AB55C' },
      { id: 'si-bigcommerce', icon: SiBigcommerce, label: 'BigCommerce', color: '#121118' },
      { id: 'si-woocommerce', icon: SiWoocommerce, label: 'WooCommerce', color: '#96588A' },
    ]
  },
  {
    name: 'CMS',
    color: '#000000',
    logos: [
      { id: 'si-wordpress', icon: SiWordpress, label: 'WordPress', color: '#21759B' },
      { id: 'si-ghost', icon: SiGhost, label: 'Ghost', color: '#15171A' },
      { id: 'si-sanity', icon: SiSanity, label: 'Sanity', color: '#F03E2F' },
      { id: 'si-contentful', icon: SiContentful, label: 'Contentful', color: '#2478CC' },
      { id: 'si-prismic', icon: SiPrismic, label: 'Prismic', color: '#5163BA' },
      { id: 'si-storyblok', icon: SiStoryblok, label: 'Storyblok', color: '#09B3AF' },
      { id: 'si-datocms', icon: SiDatocms, label: 'DatoCMS', color: '#FF7751' },
    ]
  },
  {
    name: 'Low-code & Automation',
    color: '#FF4A00',
    logos: [
      { id: 'si-retool', icon: SiRetool, label: 'Retool', color: '#3D3D3D' },
      { id: 'si-appsmith', icon: SiAppsmith, label: 'Appsmith', color: '#2A2F3D' },
      { id: 'si-budibase', icon: SiBudibase, label: 'Budibase', color: '#9981D5' },
      { id: 'si-webflow', icon: SiWebflow, label: 'Webflow', color: '#4353FF' },
      { id: 'si-framer', icon: SiFramer, label: 'Framer', color: '#0055FF' },
      { id: 'si-zapier', icon: SiZapier, label: 'Zapier', color: '#FF4A00' },
      { id: 'si-make', icon: SiMake, label: 'Make', color: '#6D00CC' },
      { id: 'si-n8n', icon: SiN8n, label: 'n8n', color: '#EA4B71' },
    ]
  },
  {
    name: 'Game Development',
    color: '#000000',
    logos: [
      { id: 'si-unity', icon: SiUnity, label: 'Unity', color: '#000000' },
      { id: 'si-unreal', icon: SiUnrealengine, label: 'Unreal Engine', color: '#0E1128' },
      { id: 'si-godot', icon: SiGodotengine, label: 'Godot', color: '#478CBF' },
      { id: 'si-steam', icon: SiSteam, label: 'Steam', color: '#000000' },
      { id: 'si-epicgames', icon: SiEpicgames, label: 'Epic Games', color: '#313131' },
    ]
  },
  {
    name: 'Design Tools',
    color: '#F24E1E',
    logos: [
      { id: 'si-figma2', icon: SiFigma, label: 'Figma', color: '#F24E1E' },
      { id: 'si-sketch', icon: SiSketch, label: 'Sketch', color: '#F7B500' },
      { id: 'si-invision', icon: SiInvision, label: 'InVision', color: '#FF3366' },
      { id: 'si-canva', icon: SiCanva, label: 'Canva', color: '#00C4CC' },
      { id: 'si-blender', icon: SiBlender, label: 'Blender', color: '#F5792A' },
    ]
  },
];

// Get all logos flattened for search
export const getAllTechLogos = () => {
  return techLogoCategories.flatMap(cat => 
    cat.logos.map(logo => ({ ...logo, category: cat.name }))
  );
};

// Search logos
export const searchTechLogos = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return getAllTechLogos().filter(logo => 
    logo.label.toLowerCase().includes(q) ||
    logo.id.toLowerCase().includes(q) ||
    logo.category.toLowerCase().includes(q)
  );
};

// Create a map of tech logo IDs to their icon components and colors
export const techLogoMap: Record<string, { icon: any; label: string; color: string }> = {};
techLogoCategories.forEach(cat => {
  cat.logos.forEach(logo => {
    techLogoMap[logo.id] = { icon: logo.icon, label: logo.label, color: logo.color };
  });
});

// Get tech logo by ID
export const getTechLogoById = (id: string) => {
  return techLogoMap[id] || null;
};

// Get tech logo by label
export const getTechLogoByLabel = (label: string) => {
  const allLogos = getAllTechLogos();
  return allLogos.find(logo => logo.label === label) || null;
};
