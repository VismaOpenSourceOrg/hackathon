package com.visma.hackathon.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping(value = "/csp-report")
public class CspReportController {

	private static final Logger log = LoggerFactory.getLogger(CspReportController.class);

	private static final ObjectMapper objectMapper = new ObjectMapper();


	@PostMapping(consumes = "application/csp-report")
	public void cspReport(HttpServletRequest request, @RequestBody String json) throws IOException {
		Map body = objectMapper.readValue(json, Map.class);
		String userAgent = request.getHeader("user-agent");

		log.warn("Received CSP report: " + body + " with user-agent=" + userAgent);
	}
}
