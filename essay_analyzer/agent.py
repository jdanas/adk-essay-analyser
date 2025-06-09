# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Essay Analyzer: Comprehensive essay analysis and feedback using ADK agents."""

from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompt
from .sub_agents.content_analyzer import content_analyzer_agent
from .sub_agents.grammar_analyzer import grammar_analyzer_agent
from .sub_agents.structure_analyzer import structure_analyzer_agent

MODEL = "gemini-2.5-flash-preview-05-20"

essay_coordinator = LlmAgent(
    name="essay_coordinator",
    model=MODEL,
    description=(
        "Comprehensive essay analysis coordinator that provides detailed feedback "
        "on grammar, structure, content, and spelling while delivering an overall score"
    ),
    instruction=prompt.ESSAY_ANALYZER_PROMPT,
    output_key="essay_analysis",
    tools=[
        AgentTool(agent=grammar_analyzer_agent),
        AgentTool(agent=structure_analyzer_agent),
        AgentTool(agent=content_analyzer_agent),
    ],
)

root_agent = essay_coordinator
