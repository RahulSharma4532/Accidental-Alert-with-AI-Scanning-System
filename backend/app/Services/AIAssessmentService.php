<?php

namespace App\Services;

use App\Models\Accident;

class AIAssessmentService
{
    /**
     * Analyze an accident report using AI logic
     */
    public function assessDamage(Accident $accident)
    {
        $severity = $accident->severity ? ucfirst(strtolower($accident->severity)) : 'Moderate';
        $type = $accident->accident_type ? ucfirst(strtolower($accident->accident_type)) : 'Collision';
        
        $affectedParts = [];
        $costMin = 0;
        $costMax = 0;
        $recommendedAction = 'Repairable';

        // Check if there are specific photo keywords (mock file detection)
        $photoKeywords = [];
        if ($accident->photos) {
            foreach ($accident->photos as $photo) {
                $filename = strtolower($photo->file_path);
                if (str_contains($filename, 'bumper')) {
                    $photoKeywords[] = 'bumper';
                }
                if (str_contains($filename, 'windshield') || str_contains($filename, 'glass')) {
                    $photoKeywords[] = 'windshield';
                }
                if (str_contains($filename, 'headlight') || str_contains($filename, 'light')) {
                    $photoKeywords[] = 'headlight';
                }
                if (str_contains($filename, 'door') || str_contains($filename, 'side')) {
                    $photoKeywords[] = 'door';
                }
            }
        }

        // Base generation on severity
        switch ($severity) {
            case 'Minor':
                $costMin = 4500;
                $costMax = 12000;
                $recommendedAction = 'Repairable';
                
                $affectedParts['Front Bumper'] = 'Scratched (25%)';
                $affectedParts['Left Headlight'] = 'Intact (0%)';
                
                // Overlay photo details if found
                if (in_array('windshield', $photoKeywords)) {
                    $affectedParts['Windshield'] = 'Minor Scratch (10%)';
                    $costMax += 3000;
                }
                break;

            case 'Critical':
                $costMin = 150000;
                $costMax = 320000;
                $recommendedAction = 'Total Loss';
                
                $affectedParts['Front Bumper'] = 'Shattered (98%)';
                $affectedParts['Radiator Core'] = 'Severely Damaged / Leaking (90%)';
                $affectedParts['Left Headlight'] = 'Shattered (100%)';
                $affectedParts['Engine Hood'] = 'Crumpled & Deformed (85%)';
                $affectedParts['Windshield'] = 'Shattered (100%)';
                $affectedParts['Chassis Frame'] = 'Structural Bend Detected (75%)';
                break;

            case 'High':
                $costMin = 65000;
                $costMax = 145000;
                $recommendedAction = 'Immediate Towing Required';
                
                $affectedParts['Front Bumper'] = 'Crushed & Detached (80%)';
                $affectedParts['Left Headlight'] = 'Shattered (95%)';
                $affectedParts['Engine Hood'] = 'Bent & Misaligned (45%)';
                $affectedParts['Windshield'] = 'Shattered (100%)';
                
                if (in_array('door', $photoKeywords)) {
                    $affectedParts['Driver Door'] = 'Deformed (60%)';
                    $costMin += 15000;
                    $costMax += 25000;
                }
                break;

            case 'Moderate':
            default:
                $costMin = 18000;
                $costMax = 42000;
                $recommendedAction = 'Repairable';
                
                $affectedParts['Front Bumper'] = 'Dent & Scratches (55%)';
                $affectedParts['Left Headlight'] = 'Cracked (40%)';
                $affectedParts['Engine Hood'] = 'Minor Dent (15%)';
                
                if (in_array('bumper', $photoKeywords)) {
                    $affectedParts['Front Bumper'] = 'Deep Dent & Structural Crack (70%)';
                    $costMin += 5000;
                    $costMax += 10000;
                }
                break;
        }

        // Update the accident
        $accident->update([
            'ai_damage_severity' => $severity,
            'ai_affected_parts' => $affectedParts,
            'ai_estimated_cost_min' => $costMin,
            'ai_estimated_cost_max' => $costMax,
            'ai_assessment_status' => 'completed'
        ]);

        return [
            'severity' => $severity,
            'affected_parts' => $affectedParts,
            'estimated_cost_min' => $costMin,
            'estimated_cost_max' => $costMax,
            'recommended_action' => $recommendedAction,
            'status' => 'completed'
        ];
    }
}
