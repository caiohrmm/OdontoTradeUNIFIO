package br.edu.unifio.odonto.desapego.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Odonto Desapego API")
                        .version("0.1.0")
                        .description("Backend do projeto Odonto Desapego - Unifio. API REST para anúncios e gestão.")
                        .contact(new Contact()
                                .name("Unifio Odonto Desapego")));
    }
}
