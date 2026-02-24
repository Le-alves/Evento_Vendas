package br.edu.ufop.trabalho1.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class GatewayApiConfig {

    @Value("${gateway.frontend.uri}")
    private String frontEndUri;

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder builder) {
        return builder.routes()
                
                .route("events-api", pred ->
                        pred.path("/api/events/**")
                                .filters(f -> f.rewritePath("/api/events", "/events"))
                                .uri("lb://trabalho-pratico-1-service")
                )
                
               
                .route("sales-api", pred ->
                        pred.path("/api/sales/**")
                                .filters(f -> f.rewritePath("/api/sales", "/sales"))
                                .uri("lb://trabalho-pratico-1-service")
                )
                
               
                .route("events-direct", pred ->
                        pred.path("/events/**")
                                .uri("lb://trabalho-pratico-1-service")
                )
                
             
                .route("sales-direct", pred ->
                        pred.path("/sales/**")
                                .uri("lb://trabalho-pratico-1-service")
                )
                
      
                .route("frontend", pred ->
                        pred.path("/**")
                                .uri(getFrontEndUri())
                )
                
                .build();
    }

    private String getFrontEndUri() {
        final String FRONTEND_DEFAULT_URI = "http://localhost:5174";
        
        if (this.frontEndUri != null) {
            return this.frontEndUri;
        }
        
        return FRONTEND_DEFAULT_URI;
    }
    

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
     
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        
        corsConfiguration.setAllowedMethods(Arrays.asList("*"));
        
       
        corsConfiguration.setAllowedHeaders(Arrays.asList("*"));
        
       
        corsConfiguration.setAllowCredentials(true);
        
       
        corsConfiguration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
            "Access-Control-Max-Age",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        
        return new CorsWebFilter(source);
    }
}