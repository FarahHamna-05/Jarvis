package com.supplyguard.controller;

import com.supplyguard.dto.RiskDto;
import com.supplyguard.service.SimulatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulator")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SimulatorController {

    private final SimulatorService simulatorService;

    @PostMapping("/disrupt")
    public ResponseEntity<Map<String, String>> simulateDisruption(@RequestBody RiskDto.SimulationRequest request) {
        simulatorService.simulateDisruption(request);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Disruption event simulated and risk recalculated."));
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetAll() {
        simulatorService.resetAllToBaseline();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "All inventory and supplier baselines restored."));
    }
}
