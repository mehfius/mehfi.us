const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME"
const url = "https://kgwnnqbpohhldfroogmm.supabase.co/"
const supabase = { "key":key, "url": url }

sessionStorage.setItem("supabase", JSON.stringify(supabase));

const load_js = async function(url){
  
    script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
  
}


