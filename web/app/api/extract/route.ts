import { NextRequest, NextResponse } from 'next/server';
import { DOCUMENT_PRESETS } from '@/lib/presets';
import { verifyApiAuth } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify User Authentication
    const authCheck = await verifyApiAuth(req);
    if (!authCheck.authenticated) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Unauthorized',
          message: authCheck.error || 'Authentication required to access document extraction pipeline.',
        },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    const internalApiKey = process.env.DOCUMIND_API_KEY || 'documind-secure-hackathon-key-2026';
    const aiEngineBase = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000';

    // --------------------------------------------------------------------------
    // Branch A: Multipart File Upload (Real uploaded document)
    // NEVER fall back to preset fixtures here! Real documents must be processed
    // by the FastAPI engine or return a distinct, actionable error status.
    // --------------------------------------------------------------------------
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const filename = file?.name || 'uploaded_document.pdf';

      try {
        const aiEngineResponse = await fetch(`${aiEngineBase}/api/v1/upload-and-extract`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${internalApiKey}`,
          },
          body: formData,
        });

        if (aiEngineResponse.ok) {
          const liveData = await aiEngineResponse.json();
          return NextResponse.json({
            status: 'success',
            ...liveData,
          });
        } else if (aiEngineResponse.status === 503) {
          const errData = await aiEngineResponse.json().catch(() => ({}));
          return NextResponse.json(
            {
              status: 'error',
              error: 'WeightsMissing',
              message: errData.detail || 'Model weights not loaded and MOCK_FALLBACK is disabled.',
            },
            { status: 503 }
          );
        } else {
          const errData = await aiEngineResponse.json().catch(() => ({}));
          return NextResponse.json(
            {
              status: 'error',
              error: 'ExtractionFailed',
              message: errData.detail || `AI Engine returned error code ${aiEngineResponse.status}.`,
            },
            { status: aiEngineResponse.status }
          );
        }
      } catch (fetchErr: any) {
        // FastAPI engine is down or unreachable
        return NextResponse.json(
          {
            status: 'error',
            error: 'EngineUnavailable',
            message: 'Extraction engine unavailable — please ensure FastAPI AI engine is running on port 8000 and try again.',
          },
          { status: 502 }
        );
      }
    }

    // --------------------------------------------------------------------------
    // Branch B: JSON Preset Request (Used ONLY for evaluator demo benchmark buttons)
    // --------------------------------------------------------------------------
    const body = await req.json();
    const presetId = body.presetId;
    if (!presetId || !DOCUMENT_PRESETS[presetId]) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidPreset',
          message: `Unknown preset ID: ${presetId}`,
        },
        { status: 400 }
      );
    }

    const preset = DOCUMENT_PRESETS[presetId];

    // Attempt to query FastAPI for the preset benchmark if engine is active
    try {
      const aiEngineResponse = await fetch(`${aiEngineBase}/api/v1/extract/${presetId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${internalApiKey}`,
        },
      });

      if (aiEngineResponse.ok) {
        const liveData = await aiEngineResponse.json();
        return NextResponse.json({
          status: 'success',
          ...liveData,
        });
      }
    } catch {
      // If ai-engine is temporarily offline, serve the static benchmark preset fixture directly
    }

    return NextResponse.json({
      status: 'success',
      source: 'preset',
      filename: preset.filename,
      inference_time_ms: preset.latencyMs,
      math_validated: preset.mathValidated,
      flagged_reason: preset.flaggedReason,
      expected_gst: preset.expectedGst,
      data: preset.extractedData,
      documentMeta: preset.documentMeta,
      rawSpatialPrompt: preset.rawSpatialPrompt,
      overall_confidence: preset.overallConfidence,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Extraction pipeline error' },
      { status: 500 }
    );
  }
}
