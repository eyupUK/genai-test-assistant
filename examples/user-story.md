US-WEATHER-001 — Get current weather for a single location (typed + schema + optional country)

As a shopper/test consumer of WeatherAPI
I want to request current weather by city/postcode/coordinates
So that I can retrieve accurate conditions for a given place

Acceptance Criteria (maps to: Scenario Outline: Get current weather for a single city)

Given a valid WeatherAPI key is configured

When I request current weather for a query (e.g., "London", "90201", "48.8567,2.3508", "SW1")

Then the HTTP status is 200

And the payload fields have valid types (e.g., location.name:string, location.country:string, location.lat:number, location.lon:number, current.temp_c:number, current.humidity:number, current.condition.text:string, current.is_day:number|boolean)

And the response conforms to current_schema.json

And if an expectedCountry is provided for the example row, location.country equals that value

And harmless whitespace around the query is ignored (e.g., " 90201 " works)