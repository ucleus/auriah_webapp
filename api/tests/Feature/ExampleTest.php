<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Ensure the application health endpoint responds successfully.
     */
    public function test_the_application_health_check_is_accessible(): void
    {
        $response = $this->get('/up');

        $response->assertStatus(200);
    }
}
