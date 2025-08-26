/* ============================== 
   Projet Backend Prolog
   SWI-Prolog REST API dynamique avec CORS
   ============================== */

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_header)).

/* ------------------------------
   1. Types de crimes réalistes
   ------------------------------ */
crime_type(vol).
crime_type(assassinat).
crime_type(escroquerie).
crime_type(corruption).
crime_type(homicide).
crime_type(agression).
crime_type(viol).
crime_type(sequestration).
crime_type(harcelement).
crime_type(vandalisme).
crime_type(extorsion).
crime_type(blanchiment).
crime_type(fraude_fiscale).
crime_type(detournement).
crime_type(piratage).
crime_type(phishing).
crime_type(ransomware).
crime_type(terrorisme).
crime_type(trafic_drogue).
crime_type(contrebande).
crime_type(crime_environnemental).

/* ------------------------------
   2. Middleware CORS
   ------------------------------ */
add_cors_headers(_) :-
    format('Access-Control-Allow-Origin: *~n', []),
    format('Access-Control-Allow-Methods: GET, POST, OPTIONS~n', []),
    format('Access-Control-Allow-Headers: Content-Type~n', []),
    flush_output.

/* ------------------------------
   3. Détermination dynamique de la culpabilité
      On considère le suspect "coupable" si le crime est reconnu
   ------------------------------ */
is_guilty_by_crime(Crime) :-
    crime_type(Crime).

/* ------------------------------
   4. API REST avec CORS
   ------------------------------ */
check_guilt_handler(Request) :-
    add_cors_headers(Request),
    ( member(method(options), Request)
    -> format('~n', [])  % Préflight OPTIONS
    ; http_parameters(Request, [
        suspect(SuspectAtom, []),
        crime(CrimeAtom, [])
      ]),
      atom_string(Suspect, SuspectAtom),
      atom_string(Crime, CrimeAtom),

      ( is_guilty_by_crime(Crime)
      -> Reply = _{suspect: Suspect, crime: Crime, result: "coupable"}
      ;  Reply = _{suspect: Suspect, crime: Crime, result: "non coupable"}
      ),
      reply_json(Reply)
    ).

:- http_handler(root(check_guilt), check_guilt_handler, []).

/* ------------------------------
   5. Démarrage serveur
   ------------------------------ */
server(Port) :- http_server(http_dispatch, [port(Port)]).

:- initialization(start).

start :-
    writeln("==> Prolog API running on http://localhost:1414 <=="),
    server(1414).
